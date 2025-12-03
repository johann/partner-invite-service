import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';
import { config } from '../config.js';
import { generateInviteEmail } from '../templates/email.js';

const router = Router();
const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);
const resend = new Resend(config.resend.apiKey);

// Middleware to verify Supabase JWT
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = user;
  next();
}

// Create invitation
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { invitee_email } = req.body;
    const inviter_id = req.user.id;

    if (!invitee_email) {
      return res.status(400).json({ error: 'invitee_email is required' });
    }

    // Check if user has reached max partnerships
    const { data: inviterProfile } = await supabase
      .from('profiles')
      .select('max_partnerships')
      .eq('id', inviter_id)
      .single();

    const { count: existingPartnerships } = await supabase
      .from('partnerships')
      .select('*', { count: 'exact', head: true })
      .or(`profile1_id.eq.${inviter_id},profile2_id.eq.${inviter_id}`)
      .eq('status', 'active');

    if (existingPartnerships >= (inviterProfile?.max_partnerships || 1)) {
      return res.status(400).json({ error: 'Maximum partnerships reached' });
    }

    // Check if invitee exists as a user
    const { data: inviteeProfile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', invitee_email)
      .single();

    // Check if partnership already exists
    if (inviteeProfile) {
      const { data: existingPartnership } = await supabase
        .from('partnerships')
        .select('*')
        .or(`and(profile1_id.eq.${inviter_id},profile2_id.eq.${inviteeProfile.id}),and(profile1_id.eq.${inviteeProfile.id},profile2_id.eq.${inviter_id})`)
        .single();

      if (existingPartnership) {
        return res.status(400).json({ error: 'Partnership already exists' });
      }
    }

    // Check for pending invitation
    const pendingQuery = supabase
      .from('partnership_requests')
      .select('*')
      .eq('from_user_id', inviter_id)
      .eq('status', 'pending');

    if (inviteeProfile) {
      pendingQuery.eq('to_user_id', inviteeProfile.id);
    } else {
      pendingQuery.eq('to_user_email', invitee_email);
    }

    const { data: pendingInvite } = await pendingQuery.single();

    if (pendingInvite) {
      return res.status(400).json({ error: 'Invitation already sent' });
    }

    // Create invitation
    const token = crypto.randomBytes(32).toString('hex');
    
    const insertData = {
      from_user_id: inviter_id,
      token,
      status: 'pending'
    };

    if (inviteeProfile) {
      insertData.to_user_id = inviteeProfile.id;
    } else {
      insertData.to_user_email = invitee_email;
    }

    const { data: invitation, error: inviteError } = await supabase
      .from('partnership_requests')
      .insert(insertData)
      .select()
      .single();

    if (inviteError) throw inviteError;

    // Get inviter details
    const { data: inviterProfileData } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', inviter_id)
      .single();

    const inviterName = inviterProfileData?.name || inviterProfileData?.email?.split('@')[0] || 'Someone';

    // Generate URLs
    const acceptUrl = `${config.app.apiUrl}/invitations/accept/${token}`;
    const declineUrl = `${config.app.apiUrl}/invitations/decline/${token}`;

    // Send email
    await resend.emails.send({
      from: config.resend.fromEmail,
      to: invitee_email,
      subject: `${inviterName} invited you to be partners`,
      html: generateInviteEmail(inviterName, acceptUrl, declineUrl)
    });

    res.json({ 
      success: true, 
      message: 'Invitation sent successfully',
      invitation: {
        id: invitation.id,
        to_user_email: invitee_email,
        status: invitation.status
      }
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

// Accept invitation
router.get('/accept/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Get invitation
    const { data: invitation, error: fetchError } = await supabase
      .from('partnership_requests')
      .select('*')
      .eq('token', token)
      .single();

    if (fetchError || !invitation) {
      return res.status(404).send('<h1>Invitation not found</h1>');
    }

    if (invitation.status !== 'pending') {
      return res.status(400).send(`<h1>Invitation already ${invitation.status}</h1>`);
    }

    if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
      return res.status(400).send('<h1>Invitation has expired</h1>');
    }

    // Determine invitee - either from to_user_id or look up by email
    let inviteeId = invitation.to_user_id;
    
    if (!inviteeId && invitation.to_user_email) {
      const { data: inviteeProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', invitation.to_user_email)
        .single();

      if (!inviteeProfile) {
        // Redirect to signup with invitation token
        return res.redirect(`${config.app.url}/signup?invitation=${token}&email=${encodeURIComponent(invitation.to_user_email)}`);
      }

      inviteeId = inviteeProfile.id;
    }

    // Create partnership
    const { error: partnershipError } = await supabase
      .from('partnerships')
      .insert({
        profile1_id: invitation.from_user_id,
        profile2_id: inviteeId,
        status: 'active'
      });

    if (partnershipError) {
      console.error('Partnership creation error:', partnershipError);
      throw partnershipError;
    }

    // Update invitation status
    await supabase
      .from('partnership_requests')
      .update({ status: 'accepted' })
      .eq('id', invitation.id);

    // Redirect to app
    res.redirect(`${config.app.url}?partnership_accepted=true`);
  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(500).send('<h1>Error accepting invitation</h1>');
  }
});

// Decline invitation
router.get('/decline/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const { data: invitation, error: fetchError } = await supabase
      .from('partnership_requests')
      .select('*')
      .eq('token', token)
      .single();

    if (fetchError || !invitation) {
      return res.status(404).send('<h1>Invitation not found</h1>');
    }

    if (invitation.status !== 'pending') {
      return res.status(400).send(`<h1>Invitation already ${invitation.status}</h1>`);
    }

    // Update invitation status
    await supabase
      .from('partnership_requests')
      .update({ status: 'declined' })
      .eq('id', invitation.id);

    res.send(`
      <html>
        <head><style>body { font-family: Arial; text-align: center; padding: 50px; }</style></head>
        <body>
          <h1>Invitation Declined</h1>
          <p>You have declined the partnership invitation.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error declining invitation:', error);
    res.status(500).send('<h1>Error declining invitation</h1>');
  }
});

// Get user's partnerships
router.get('/partnerships', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: partnerships, error } = await supabase
      .from('partnerships')
      .select(`
        *,
        profile1:profiles!partnerships_profile1_id_fkey(id, name, email, profile_picture_url),
        profile2:profiles!partnerships_profile2_id_fkey(id, name, email, profile_picture_url)
      `)
      .or(`profile1_id.eq.${userId},profile2_id.eq.${userId}`)
      .eq('status', 'active');

    if (error) throw error;

    // Format response to return partner info
    const formattedPartnerships = partnerships.map(p => {
      const isProfile1 = p.profile1_id === userId;
      const partner = isProfile1 ? p.profile2 : p.profile1;
      
      return {
        partnership_id: p.id,
        partner: {
          id: partner.id,
          name: partner.name,
          email: partner.email,
          profile_picture_url: partner.profile_picture_url
        },
        created_at: p.created_at,
        streak_days: p.streak_days
      };
    });

    res.json({ partnerships: formattedPartnerships });
  } catch (error) {
    console.error('Error fetching partnerships:', error);
    res.status(500).json({ error: 'Failed to fetch partnerships' });
  }
});

// Get pending invitations (both sent and received)
router.get('/pending', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's email for checking email-based invites
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    // Get invitations sent by user
    const { data: sentInvites } = await supabase
      .from('partnership_requests')
      .select('*, to_user:profiles!partnership_requests_to_user_id_fkey(name, email)')
      .eq('from_user_id', userId)
      .eq('status', 'pending');

    // Get invitations received by user (both user_id and email based)
    const { data: receivedInvites } = await supabase
      .from('partnership_requests')
      .select('*, from_user:profiles!partnership_requests_from_user_id_fkey(name, email, profile_picture_url)')
      .or(`to_user_id.eq.${userId},to_user_email.eq.${userProfile?.email}`)
      .eq('status', 'pending');

    res.json({
      sent: sentInvites || [],
      received: receivedInvites || []
    });
  } catch (error) {
    console.error('Error fetching pending invitations:', error);
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
});

export default router;