/**
 * Local OAuth Proxy Server
 * Handles Whoop OAuth token exchange for local development
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config({ path: '.env.local' })

const app = express()
const PORT = 4000

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'OAuth proxy server running' })
})

// OAuth Callback Handler
app.post('/api/auth/callback', async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' })
    }

    const clientId = process.env.VITE_WHOOP_CLIENT_ID
    const clientSecret = process.env.VITE_WHOOP_CLIENT_SECRET
    const redirectUri = process.env.VITE_WHOOP_REDIRECT_URI

    if (!clientId || !clientSecret) {
      console.error('❌ Missing Whoop credentials in .env.local')
      return res.status(500).json({
        error: 'Server configuration error',
        hint: 'Check VITE_WHOOP_CLIENT_ID and VITE_WHOOP_CLIENT_SECRET in .env.local'
      })
    }

    console.log('🔄 Exchanging code for token...')
    console.log('Client ID:', clientId.substring(0, 8) + '...')
    console.log('Redirect URI:', redirectUri)

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

    const responseData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('❌ Token exchange failed:', responseData)
      return res.status(tokenResponse.status).json({
        error: 'Failed to exchange authorization code for token',
        details: responseData,
      })
    }

    console.log('✅ Token exchange successful!')
    console.log('Access token:', responseData.access_token.substring(0, 20) + '...')

    // Return tokens to frontend
    return res.status(200).json({
      access_token: responseData.access_token,
      refresh_token: responseData.refresh_token,
      expires_in: responseData.expires_in,
      token_type: responseData.token_type,
    })
  } catch (error) {
    console.error('❌ OAuth callback error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 OAuth Proxy Server running on http://localhost:${PORT}`)
  console.log(`📡 Callback endpoint: http://localhost:${PORT}/api/auth/callback\n`)
})
