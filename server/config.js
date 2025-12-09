import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    anonKey: process.env.SUPABASE_SERVICE_ANON_KEY  
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.FROM_EMAIL || 'invites@yourdomain.com'
  },
  // Base URL for the application (used for email links which need absolute URLs)
  // In production, set this to your domain (e.g., https://yourdomain.com)
  // In development, defaults to localhost
  baseUrl: process.env.BASE_URL || process.env.APP_URL || (process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000')
};