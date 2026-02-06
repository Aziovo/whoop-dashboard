/**
 * Vercel Serverless Function - Whoop OAuth Token Exchange
 * Handles the OAuth callback and exchanges code for access token
 * Avoids CORS issues by doing token exchange server-side
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' })
    }

    // Get credentials from environment variables (set in Vercel)
    // Note: Backend uses regular env vars (no VITE_ prefix)
    // Frontend uses VITE_ prefix for client-side exposure
    const clientId = process.env.WHOOP_CLIENT_ID || process.env.VITE_WHOOP_CLIENT_ID
    const clientSecret = process.env.WHOOP_CLIENT_SECRET || process.env.VITE_WHOOP_CLIENT_SECRET
    const redirectUri = process.env.WHOOP_REDIRECT_URI || process.env.VITE_WHOOP_REDIRECT_URI || 'http://localhost:3000/auth/callback'

    if (!clientId || !clientSecret) {
      console.error('Missing Whoop credentials in environment')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.prod.whoop.com/oauth/token', {
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
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json()
      console.error('Token exchange failed:', error)
      return res.status(tokenResponse.status).json({
        error: 'Failed to exchange authorization code for token',
        details: error,
      })
    }

    const tokenData = await tokenResponse.json()

    // Return tokens to frontend
    return res.status(200).json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
    })
  } catch (error) {
    console.error('OAuth callback error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    })
  }
}
