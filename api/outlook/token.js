/**
 * Outlook OAuth Token Exchange
 * Handles code-to-token exchange for Outlook authentication
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    const clientId = process.env.VITE_OUTLOOK_CLIENT_ID || process.env.OUTLOOK_CLIENT_ID;
    const clientSecret = process.env.VITE_OUTLOOK_CLIENT_SECRET || process.env.OUTLOOK_CLIENT_SECRET;
    const redirectUri = process.env.VITE_OUTLOOK_REDIRECT_URI || process.env.OUTLOOK_REDIRECT_URI || 'http://localhost:3000/auth/outlook';

    if (!clientId || !clientSecret) {
      console.error('Missing Outlook credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Exchange code for token
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'Mail.Read Mail.Read.Shared offline_access'
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Token exchange failed:', error);
      return res.status(tokenResponse.status).json({
        error: 'Failed to exchange authorization code',
        details: error,
      });
    }

    const tokenData = await tokenResponse.json();

    return res.status(200).json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
    });
  } catch (error) {
    console.error('Outlook token exchange error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
