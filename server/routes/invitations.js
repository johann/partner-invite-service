import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';
import { config } from '../config.js';
import { generateInviteEmail } from '../templates/email.js';

const router = Router();

// Two clients: one for auth validation (anon key), one for admin operations (service role key)
const supabaseAuth = createClient(config.supabase.url, config.supabase.anonKey);
const supabaseAdmin = createClient(config.supabase.url, config.supabase.serviceRoleKey);

const resend = new Resend(config.resend.apiKey);

// Middleware to verify Supabase JWT - uses anon key client
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);
  
  // Use anon key client to validate the user's JWT
  const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
  
  if (error || !user) {
    console.error('Auth validation failed:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = user;
  next();
}

// Create invitation
router.post('/', authenticateUser, async (req, res) => {
  console.log('========================================');
  console.log('🚀 [POST /invitations] REQUEST STARTED');
  console.log('========================================');
  
  try {
    const { invitee_email } = req.body;
    const inviter_id = req.user.id;

    console.log('📧 [STEP 1] Request Details:');
    console.log('   - invitee_email:', invitee_email);
    console.log('   - invitee_email type:', typeof invitee_email);
    console.log('   - invitee_email lowercase:', invitee_email?.toLowerCase());
    console.log('   - inviter_id:', inviter_id);
    console.log('   - inviter_id type:', typeof inviter_id);
    console.log('   - req.user:', JSON.stringify(req.user, null, 2));

    if (!invitee_email) {
      console.log('❌ [VALIDATION] invitee_email is missing');
      return res.status(400).json({ error: 'invitee_email is required' });
    }

    // Get inviter's profile
    console.log('📋 [STEP 2] Fetching inviter profile...');
    const { data: inviterProfile, error: inviterError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, max_partnerships')
      .eq('id', inviter_id)
      .single();

    console.log('   - inviterProfile:', JSON.stringify(inviterProfile, null, 2));
    console.log('   - inviterError:', inviterError);
    console.log('   - inviter email from profile:', inviterProfile?.email);
    console.log('   - inviter email type:', typeof inviterProfile?.email);
    console.log('   - inviter email lowercase:', inviterProfile?.email?.toLowerCase());

    // Self-invitation check by email
    console.log('🔍 [STEP 3] Self-invitation check (email comparison):');
    console.log('   - invitee_email.toLowerCase():', invitee_email?.toLowerCase());
    console.log('   - inviterProfile.email?.toLowerCase():', inviterProfile?.email?.toLowerCase());
    console.log('   - Are they equal?:', inviterProfile?.email?.toLowerCase() === invitee_email?.toLowerCase());
    
    if (inviterProfile?.email?.toLowerCase() === invitee_email?.toLowerCase()) {
      console.log('❌ [BLOCKED] Self-invitation detected via email comparison!');
      return res.status(400).json({ error: 'You cannot invite yourself' });
    }
    console.log('   ✅ Email self-invite check passed');

    // Check if user has reached max partnerships
    console.log('📊 [STEP 4] Checking existing partnerships count...');
    const { count: existingPartnerships, error: countError } = await supabaseAdmin
      .from('partnerships')
      .select('*', { count: 'exact', head: true })
      .or(`profile1_id.eq.${inviter_id},profile2_id.eq.${inviter_id}`)
      .eq('status', 'active');

    console.log('   - existingPartnerships count:', existingPartnerships);
    console.log('   - countError:', countError);
    console.log('   - max_partnerships:', inviterProfile?.max_partnerships);

    if (existingPartnerships >= (inviterProfile?.max_partnerships || 1)) {
      console.log('❌ [BLOCKED] Maximum partnerships reached');
      return res.status(400).json({ error: 'Maximum partnerships reached' });
    }
    console.log('   ✅ Partnership limit check passed');

    // Check if invitee exists as a user
    console.log('👤 [STEP 5] Looking up invitee by email...');
    console.log('   - Searching for email:', invitee_email);
    
    const { data: inviteeProfile, error: inviteeError } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('email', invitee_email)
      .single();

    console.log('   - inviteeProfile:', JSON.stringify(inviteeProfile, null, 2));
    console.log('   - inviteeError:', inviteeError);
    console.log('   - inviteeProfile found?:', !!inviteeProfile);
    
    if (inviteeProfile) {
      console.log('   - inviteeProfile.id:', inviteeProfile.id);
      console.log('   - inviteeProfile.id type:', typeof inviteeProfile.id);
      console.log('   - inviteeProfile.email:', inviteeProfile.email);
    }

    // Self-invitation check by ID
    console.log('🔍 [STEP 6] Self-invitation check (ID comparison):');
    console.log('   - inviter_id:', inviter_id);
    console.log('   - inviter_id type:', typeof inviter_id);
    console.log('   - inviteeProfile?.id:', inviteeProfile?.id);
    console.log('   - inviteeProfile?.id type:', typeof inviteeProfile?.id);
    console.log('   - Strict equality (===):', inviteeProfile?.id === inviter_id);
    console.log('   - Loose equality (==):', inviteeProfile?.id == inviter_id);
    console.log('   - String comparison:', String(inviteeProfile?.id) === String(inviter_id));
    
    if (inviteeProfile && String(inviteeProfile.id) === String(inviter_id)) {
      console.log('❌ [BLOCKED] Self-invitation detected via ID comparison!');
      return res.status(400).json({ error: 'You cannot invite yourself' });
    }
    console.log('   ✅ ID self-invite check passed');

    // Check if partnership already exists
    if (inviteeProfile) {
      console.log('🤝 [STEP 7] Checking for existing partnership...');
      console.log('   - Query: profile1_id=' + inviter_id + ', profile2_id=' + inviteeProfile.id);
      
      const { data: existingPartnership, error: partnershipError } = await supabaseAdmin
        .from('partnerships')
        .select('*')
        .or(`and(profile1_id.eq.${inviter_id},profile2_id.eq.${inviteeProfile.id}),and(profile1_id.eq.${inviteeProfile.id},profile2_id.eq.${inviter_id})`)
        .single();

      console.log('   - existingPartnership:', JSON.stringify(existingPartnership, null, 2));
      console.log('   - partnershipError:', partnershipError);

      if (existingPartnership) {
        console.log('❌ [BLOCKED] Partnership already exists');
        return res.status(400).json({ error: 'Partnership already exists' });
      }
      console.log('   ✅ No existing partnership found');
    } else {
      console.log('⏭️ [STEP 7] Skipping partnership check - invitee not in system');
    }

    // Check for pending invitation
    console.log('⏳ [STEP 8] Checking for pending invitations...');
    
    let pendingQuery = supabaseAdmin
      .from('partnership_requests')
      .select('*')
      .eq('from_user_id', inviter_id)
      .eq('status', 'pending');

    if (inviteeProfile) {
      console.log('   - Checking by to_user_id:', inviteeProfile.id);
      pendingQuery = pendingQuery.eq('to_user_id', inviteeProfile.id);
    } else {
      console.log('   - Checking by to_user_email:', invitee_email);
      pendingQuery = pendingQuery.eq('to_user_email', invitee_email);
    }

    const { data: pendingInvite, error: pendingError } = await pendingQuery.single();

    console.log('   - pendingInvite:', JSON.stringify(pendingInvite, null, 2));
    console.log('   - pendingError:', pendingError);

    if (pendingInvite) {
      console.log('❌ [BLOCKED] Pending invitation already exists');
      return res.status(400).json({ error: 'Invitation already sent' });
    }
    console.log('   ✅ No pending invitation found');

    // Create invitation
    console.log('📝 [STEP 9] Creating invitation...');
    const token = crypto.randomBytes(32).toString('hex');
    
    const insertData = {
      from_user_id: inviter_id,
      token,
      status: 'pending'
    };

    if (inviteeProfile) {
      insertData.to_user_id = inviteeProfile.id;
      console.log('   - Setting to_user_id:', inviteeProfile.id);
    } else {
      insertData.to_user_email = invitee_email;
      console.log('   - Setting to_user_email:', invitee_email);
    }

    console.log('   - insertData:', JSON.stringify(insertData, null, 2));
    console.log('   - CRITICAL CHECK - from_user_id === to_user_id?:', insertData.from_user_id === insertData.to_user_id);
    console.log('   - CRITICAL CHECK - String comparison:', String(insertData.from_user_id) === String(insertData.to_user_id));

    if (String(insertData.from_user_id) === String(insertData.to_user_id)) {
      console.log('❌ [BLOCKED] CRITICAL: from_user_id equals to_user_id! Blocking insert.');
      return res.status(400).json({ error: 'You cannot invite yourself' });
    }

    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from('partnership_requests')
      .insert(insertData)
      .select()
      .single();

    console.log('   - invitation result:', JSON.stringify(invitation, null, 2));
    console.log('   - inviteError:', inviteError);

    if (inviteError) {
      console.log('❌ [ERROR] Failed to insert invitation:', inviteError);
      throw inviteError;
    }
    console.log('   ✅ Invitation created successfully');

    const inviterName = inviterProfile?.name || inviterProfile?.email?.split('@')[0] || 'Someone';
    console.log('   - inviterName for email:', inviterName);

    // Generate URLs - need absolute URLs for email links
    const acceptUrl = `${config.baseUrl}/api/invitations/accept/${token}`;
    const declineUrl = `${config.baseUrl}/api/invitations/decline/${token}`;
    console.log('   - acceptUrl:', acceptUrl);
    console.log('   - declineUrl:', declineUrl);

    // Send email
    console.log('📬 [STEP 10] Sending email...');
    await resend.emails.send({
      from: config.resend.fromEmail,
      to: invitee_email,
      subject: `${inviterName} invited you to be partners`,
      html: generateInviteEmail(inviterName, acceptUrl, declineUrl)
    });
    console.log('   ✅ Email sent successfully');

    console.log('========================================');
    console.log('✅ [POST /invitations] REQUEST COMPLETED SUCCESSFULLY');
    console.log('========================================');

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
    console.log('========================================');
    console.log('❌ [POST /invitations] REQUEST FAILED');
    console.log('========================================');
    console.error('Error creating invitation:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details field:', error.details);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

// Accept invitation
router.get('/accept/:token', async (req, res) => {
  console.log('========================================');
  console.log('🚀 [GET /invitations/accept/:token] REQUEST STARTED');
  console.log('========================================');
  
  try {
    const { token } = req.params;
    console.log('🎟️ [STEP 1] Token:', token);

    // Get invitation
    console.log('📋 [STEP 2] Fetching invitation...');
    const { data: invitation, error: fetchError } = await supabaseAdmin
      .from('partnership_requests')
      .select('*')
      .eq('token', token)
      .single();

    console.log('   - invitation:', JSON.stringify(invitation, null, 2));
    console.log('   - fetchError:', fetchError);

    if (fetchError || !invitation) {
      console.log('❌ [ERROR] Invitation not found');
      return res.status(404).send('<h1>Invitation not found</h1>');
    }

    if (invitation.status !== 'pending') {
      console.log('❌ [ERROR] Invitation already processed:', invitation.status);
      return res.status(400).send(`<h1>Invitation already ${invitation.status}</h1>`);
    }

    if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
      console.log('❌ [ERROR] Invitation expired');
      return res.status(400).send('<h1>Invitation has expired</h1>');
    }

    // Determine invitee - either from to_user_id or look up by email
    console.log('👤 [STEP 3] Determining invitee...');
    let inviteeId = invitation.to_user_id;
    console.log('   - to_user_id from invitation:', inviteeId);
    
    if (!inviteeId && invitation.to_user_email) {
      console.log('   - Looking up by email:', invitation.to_user_email);
      const { data: inviteeProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', invitation.to_user_email)
        .single();

      console.log('   - inviteeProfile:', JSON.stringify(inviteeProfile, null, 2));

      if (!inviteeProfile) {
        console.log('   - Invitee not found, redirecting to signup');
        // Redirect to signup with invitation token
        return res.redirect(`/signup?invitation=${token}&email=${encodeURIComponent(invitation.to_user_email)}`);
      }

      inviteeId = inviteeProfile.id;
    }

    console.log('   - Final inviteeId:', inviteeId);
    console.log('   - from_user_id:', invitation.from_user_id);
    console.log('   - Are they the same?:', String(inviteeId) === String(invitation.from_user_id));

    // Create partnership
    console.log('🤝 [STEP 4] Creating partnership...');
    console.log('   - profile1_id:', invitation.from_user_id);
    console.log('   - profile2_id:', inviteeId);
    
    const { error: partnershipError } = await supabaseAdmin
      .from('partnerships')
      .insert({
        profile1_id: invitation.from_user_id,
        profile2_id: inviteeId,
        status: 'active'
      });

    if (partnershipError) {
      console.error('❌ [ERROR] Partnership creation error:', partnershipError);
      throw partnershipError;
    }
    console.log('   ✅ Partnership created');

    // Update invitation status
    console.log('📝 [STEP 5] Updating invitation status...');
    await supabaseAdmin
      .from('partnership_requests')
      .update({ status: 'accepted' })
      .eq('id', invitation.id);
    console.log('   ✅ Invitation status updated');

    console.log('========================================');
    console.log('✅ [GET /invitations/accept/:token] REQUEST COMPLETED');
    console.log('========================================');

    // Redirect to app
    res.redirect(`/?partnership_accepted=true`);
  } catch (error) {
    console.log('========================================');
    console.log('❌ [GET /invitations/accept/:token] REQUEST FAILED');
    console.log('========================================');
    console.error('Error accepting invitation:', error);
    res.status(500).send('<h1>Error accepting invitation</h1>');
  }
});

// Decline invitation
router.get('/decline/:token', async (req, res) => {
  console.log('========================================');
  console.log('🚀 [GET /invitations/decline/:token] REQUEST STARTED');
  console.log('========================================');
  
  try {
    const { token } = req.params;
    console.log('🎟️ Token:', token);

    const { data: invitation, error: fetchError } = await supabaseAdmin
      .from('partnership_requests')
      .select('*')
      .eq('token', token)
      .single();

    console.log('   - invitation:', JSON.stringify(invitation, null, 2));
    console.log('   - fetchError:', fetchError);

    if (fetchError || !invitation) {
      console.log('❌ [ERROR] Invitation not found');
      return res.status(404).send('<h1>Invitation not found</h1>');
    }

    if (invitation.status !== 'pending') {
      console.log('❌ [ERROR] Invitation already processed:', invitation.status);
      return res.status(400).send(`<h1>Invitation already ${invitation.status}</h1>`);
    }

    // Update invitation status
    await supabaseAdmin
      .from('partnership_requests')
      .update({ status: 'declined' })
      .eq('id', invitation.id);

    console.log('✅ Invitation declined');
    console.log('========================================');

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
    console.log('========================================');
    console.log('❌ [GET /invitations/decline/:token] REQUEST FAILED');
    console.log('========================================');
    console.error('Error declining invitation:', error);
    res.status(500).send('<h1>Error declining invitation</h1>');
  }
});

// Get user's partnerships
router.get('/partnerships', authenticateUser, async (req, res) => {
  console.log('========================================');
  console.log('🚀 [GET /invitations/partnerships] REQUEST STARTED');
  console.log('========================================');
  
  try {
    const userId = req.user.id;
    console.log('👤 userId:', userId);

    const { data: partnerships, error } = await supabaseAdmin
      .from('partnerships')
      .select(`
        *,
        profile1:profiles!partnerships_profile1_id_fkey(id, name, email, profile_picture_url),
        profile2:profiles!partnerships_profile2_id_fkey(id, name, email, profile_picture_url)
      `)
      .or(`profile1_id.eq.${userId},profile2_id.eq.${userId}`)
      .eq('status', 'active');

    console.log('   - partnerships count:', partnerships?.length);
    console.log('   - error:', error);

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

    console.log('✅ Returning', formattedPartnerships.length, 'partnerships');
    console.log('========================================');

    res.json({ partnerships: formattedPartnerships });
  } catch (error) {
    console.log('========================================');
    console.log('❌ [GET /invitations/partnerships] REQUEST FAILED');
    console.log('========================================');
    console.error('Error fetching partnerships:', error);
    res.status(500).json({ error: 'Failed to fetch partnerships' });
  }
});

// Get pending invitations (both sent and received)
router.get('/pending', authenticateUser, async (req, res) => {
  console.log('========================================');
  console.log('🚀 [GET /invitations/pending] REQUEST STARTED');
  console.log('========================================');
  
  try {
    const userId = req.user.id;
    console.log('👤 userId:', userId);

    // Get user's email for checking email-based invites
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    console.log('   - userProfile email:', userProfile?.email);

    // Get invitations sent by user
    const { data: sentInvites } = await supabaseAdmin
      .from('partnership_requests')
      .select('*, to_user:profiles!partnership_requests_to_user_id_fkey(name, email)')
      .eq('from_user_id', userId)
      .eq('status', 'pending');

    console.log('   - sentInvites count:', sentInvites?.length);

    // Get invitations received by user (both user_id and email based)
    const { data: receivedInvites } = await supabaseAdmin
      .from('partnership_requests')
      .select('*, from_user:profiles!partnership_requests_from_user_id_fkey(name, email, profile_picture_url)')
      .or(`to_user_id.eq.${userId},to_user_email.eq.${userProfile?.email}`)
      .eq('status', 'pending');

    console.log('   - receivedInvites count:', receivedInvites?.length);
    console.log('========================================');

    res.json({
      sent: sentInvites || [],
      received: receivedInvites || []
    });
  } catch (error) {
    console.log('========================================');
    console.log('❌ [GET /invitations/pending] REQUEST FAILED');
    console.log('========================================');
    console.error('Error fetching pending invitations:', error);
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
});

export default router;