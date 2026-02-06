/**
 * Outlook Token Refresh
 * Refreshes expired access tokens
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { refresh_token, account } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Missing refresh token' });
    }

    const clientId = process.env.VITE_OUTLOOK_CLIENT_ID || process.env.OUTLOOK_CLIENT_ID;
    const clientSecret = process.env.VITE_OUTLOOK_CLIENT_SECRET || process.env.OUTLOOK_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Refresh the token
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'Mail.Read Mail.Read.Shared offline_access'
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Token refresh failed:', error);
      return res.status(tokenResponse.status).json({
        error: 'Failed to refresh token',
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
    console.error('Token refresh error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
