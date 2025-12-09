export function generateInviteEmail(inviterName, acceptUrl, declineUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          margin: 10px 5px;
          text-decoration: none; 
          border-radius: 5px; 
          font-weight: bold;
        }
        .accept { background-color: #10b981; color: white; }
        .decline { background-color: #ef4444; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Partnership Invitation</h2>
        <p><strong>${inviterName}</strong> would like to add you as a partner.</p>
        <p>Click below to respond to this invitation:</p>
        <div style="margin: 30px 0;">
          <a href="${acceptUrl}" class="button accept">Accept Partnership</a>
          <a href="${declineUrl}" class="button decline">Decline</a>
        </div>
        <p style="color: #666; font-size: 14px;">This invitation will expire in 7 days.</p>
      </div>
    </body>
    </html>
  `;
}