// Whoop API Integration Layer
// Based on Whoop API v2 Documentation

const WHOOP_CONFIG = {
  authUrl: import.meta.env.VITE_WHOOP_AUTH_URL || 'https://api.prod.whoop.com/oauth/authorize',
  tokenUrl: import.meta.env.VITE_WHOOP_TOKEN_URL || 'https://api.prod.whoop.com/oauth/token',
  apiBase: import.meta.env.VITE_WHOOP_API_BASE || 'https://api.prod.whoop.com/v2',
  clientId: import.meta.env.VITE_WHOOP_CLIENT_ID,
  clientSecret: import.meta.env.VITE_WHOOP_CLIENT_SECRET,
  redirectUri: (() => {
    // Priority 1: Use environment variable if set
    if (import.meta.env.VITE_WHOOP_REDIRECT_URI) {
      return import.meta.env.VITE_WHOOP_REDIRECT_URI;
    }
    
    // Priority 2: Auto-detect current domain for redirect
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      // Ensure it's HTTPS in production
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return `${origin}/auth/callback`;
      }
      // Force HTTPS for production domains
      return `${origin.replace('http://', 'https://')}/auth/callback`;
    }
    
    // Priority 3: Fallback
    return 'http://localhost:3000/auth/callback';
  })()
}

// Token management
export const tokenManager = {
  getToken: () => localStorage.getItem('whoop_access_token'),
  setToken: (token) => localStorage.setItem('whoop_access_token', token),
  getRefreshToken: () => localStorage.getItem('whoop_refresh_token'),
  setRefreshToken: (token) => localStorage.setItem('whoop_refresh_token', token),
  clearTokens: () => {
    localStorage.removeItem('whoop_access_token')
    localStorage.removeItem('whoop_refresh_token')
    localStorage.removeItem('whoop_token_expiry')
  },
  setExpiry: (expiresIn) => {
    const expiry = Date.now() + (expiresIn * 1000)
    localStorage.setItem('whoop_token_expiry', expiry.toString())
  },
  isExpired: () => {
    const expiry = localStorage.getItem('whoop_token_expiry')
    if (!expiry) return true
    return Date.now() > parseInt(expiry)
  }
}

// OAuth 2.0 Flow
export const initOAuth = () => {
  if (!WHOOP_CONFIG.clientId) {
    alert('⚠️ OAuth setup incomplete. Using demo mode. Complete WHOOP_SETUP.md for real data.')
    return
  }

  const params = new URLSearchParams({
    client_id: WHOOP_CONFIG.clientId,
    response_type: 'code',
    redirect_uri: WHOOP_CONFIG.redirectUri,
    scope: 'read:recovery read:cycles read:workout read:sleep read:profile read:body_measurement offline'
  })

  // Redirect to Whoop OAuth
  window.location.href = `${WHOOP_CONFIG.authUrl}?${params.toString()}`
}

export const handleOAuthCallback = async (code) => {
  try {
    // Use local OAuth proxy server to exchange code for token
    // Local dev: http://localhost:4000/api/auth/callback
    // Production: /api/auth/callback (Vercel serverless)
    const apiEndpoint = import.meta.env.MODE === 'production' 
      ? '/api/auth/callback'
      : 'http://localhost:4000/api/auth/callback'

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Token exchange failed')
    }

    const data = await response.json()
    tokenManager.setToken(data.access_token)
    tokenManager.setRefreshToken(data.refresh_token)
    tokenManager.setExpiry(data.expires_in)

    return data
  } catch (error) {
    console.error('OAuth callback error:', error)
    throw error
  }
}

export const refreshAccessToken = async () => {
  const refreshToken = tokenManager.getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const tokenData = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: WHOOP_CONFIG.clientId,
    client_secret: WHOOP_CONFIG.clientSecret
  })

  try {
    const response = await fetch(WHOOP_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenData.toString()
    })

    if (!response.ok) {
      throw new Error('Token refresh failed')
    }

    const data = await response.json()
    tokenManager.setToken(data.access_token)
    if (data.refresh_token) {
      tokenManager.setRefreshToken(data.refresh_token)
    }
    tokenManager.setExpiry(data.expires_in)

    return data
  } catch (error) {
    console.error('Token refresh error:', error)
    tokenManager.clearTokens()
    throw error
  }
}

// API Request Helper
const apiRequest = async (endpoint, options = {}) => {
  let token = tokenManager.getToken()

  // Check if token is expired and refresh if needed
  if (token && tokenManager.isExpired()) {
    try {
      await refreshAccessToken()
      token = tokenManager.getToken()
    } catch (error) {
      console.error('Failed to refresh token:', error)
      return null
    }
  }

  if (!token) {
    console.warn('No access token available. Using demo data.')
    return null
  }

  try {
    const response = await fetch(`${WHOOP_CONFIG.apiBase}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Token invalid, try refresh
        await refreshAccessToken()
        token = tokenManager.getToken()
        
        // Retry request
        const retryResponse = await fetch(`${WHOOP_CONFIG.apiBase}${endpoint}`, {
          ...options,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
          }
        })
        
        if (!retryResponse.ok) {
          throw new Error(`API request failed: ${retryResponse.statusText}`)
        }
        
        return await retryResponse.json()
      }
      
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API request error:', error)
    return null
  }
}

// API Endpoints
export const whoopAPI = {
  // Get user profile
  getProfile: async () => {
    return await apiRequest('/user/profile/basic')
  },

  // Get cycles (recovery, sleep, strain data)
  getCycles: async (startDate, endDate) => {
    const params = new URLSearchParams({
      start: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end: endDate || new Date().toISOString()
    })
    return await apiRequest(`/cycle?${params.toString()}`)
  },

  // Get recovery data
  getRecovery: async (startDate, endDate) => {
    const params = new URLSearchParams({
      start: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end: endDate || new Date().toISOString()
    })
    return await apiRequest(`/recovery?${params.toString()}`)
  },

  // Get sleep data
  getSleep: async (startDate, endDate) => {
    const params = new URLSearchParams({
      start: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end: endDate || new Date().toISOString()
    })
    return await apiRequest(`/sleep?${params.toString()}`)
  },

  // Get workout/strain data
  getWorkout: async (startDate, endDate) => {
    const params = new URLSearchParams({
      start: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end: endDate || new Date().toISOString()
    })
    return await apiRequest(`/workout?${params.toString()}`)
  },

  // Get physiological metrics (HRV, RHR)
  getPhysiological: async (startDate, endDate) => {
    const params = new URLSearchParams({
      start: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end: endDate || new Date().toISOString()
    })
    return await apiRequest(`/physiological_metrics?${params.toString()}`)
  },

  // Get body measurements
  getBodyMeasurement: async () => {
    return await apiRequest('/body_measurement')
  }
}

// Demo data generator for testing without API connection
export const generateDemoData = () => {
  const today = new Date()
  const demoData = {
    recovery: [],
    sleep: [],
    strain: [],
    hrv: [],
    heartRate: []
  }

  // Generate 7 days of demo data
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    // Recovery score (0-100%)
    demoData.recovery.push({
      date: dateStr,
      score: Math.floor(Math.random() * 40) + 50, // 50-90%
      hrv: Math.floor(Math.random() * 50) + 50, // 50-100ms
      rhr: Math.floor(Math.random() * 20) + 50 // 50-70 bpm
    })

    // Sleep performance
    demoData.sleep.push({
      date: dateStr,
      duration: Math.floor(Math.random() * 180) + 360, // 6-9 hours in minutes
      efficiency: Math.floor(Math.random() * 20) + 75, // 75-95%
      quality: Math.floor(Math.random() * 40) + 60 // 60-100%
    })

    // Strain score (0-21)
    demoData.strain.push({
      date: dateStr,
      score: Math.floor(Math.random() * 10) + 8 // 8-18
    })

    // HRV trend
    demoData.hrv.push({
      date: dateStr,
      value: Math.floor(Math.random() * 50) + 50
    })

    // Average heart rate
    demoData.heartRate.push({
      date: dateStr,
      avg: Math.floor(Math.random() * 20) + 60,
      max: Math.floor(Math.random() * 40) + 140
    })
  }

  return demoData
}

export default whoopAPI
