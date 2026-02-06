import { createContext, useContext, useState, useEffect } from 'react'
import { whoopAPI, generateDemoData, tokenManager } from '../utils/whoopApi'

const WhoopContext = createContext()

export const useWhoop = () => {
  const context = useContext(WhoopContext)
  if (!context) {
    throw new Error('useWhoop must be used within WhoopProvider')
  }
  return context
}

export const WhoopProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [whoopData, setWhoopData] = useState(null)
  const [usingDemoData, setUsingDemoData] = useState(false)

  // Check if user is authenticated on mount and handle OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      // Check for authorization code in URL (OAuth callback)
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (code) {
        try {
          setLoading(true)
          // Exchange code for token using OAuth proxy
          const apiEndpoint = import.meta.env.MODE === 'production'
            ? '/api/auth/callback'
            : 'http://localhost:4000/api/auth/callback'
          
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          })

          if (response.ok) {
            const tokenData = await response.json()
            tokenManager.setToken(tokenData.access_token)
            tokenManager.setRefreshToken(tokenData.refresh_token)
            tokenManager.setExpiry(tokenData.expires_in)
            setIsAuthenticated(true)
            
            // Clear URL
            window.history.replaceState({}, document.title, window.location.pathname)
            
            // Load Whoop data
            await loadWhoopData()
          } else {
            console.error('Token exchange failed')
            setUsingDemoData(true)
            setWhoopData(generateDemoData())
          }
        } catch (err) {
          console.error('OAuth callback error:', err)
          setUsingDemoData(true)
          setWhoopData(generateDemoData())
        } finally {
          setLoading(false)
        }
        return
      }

      // Normal flow - check if already authenticated
      const token = tokenManager.getToken()
      if (token && !tokenManager.isExpired()) {
        setIsAuthenticated(true)
        loadWhoopData()
      } else {
        // Use demo data if not authenticated
        setUsingDemoData(true)
        setWhoopData(generateDemoData())
      }
    }

    handleCallback()
  }, [])

  const loadWhoopData = async () => {
    setLoading(true)
    try {
      const [profile, cycles, recovery, sleep, workout, physiological] = await Promise.all([
        whoopAPI.getProfile(),
        whoopAPI.getCycles(),
        whoopAPI.getRecovery(),
        whoopAPI.getSleep(),
        whoopAPI.getWorkout(),
        whoopAPI.getPhysiological()
      ])

      if (profile || cycles || recovery || sleep) {
        setUserData(profile)
        setWhoopData({
          cycles: cycles?.records || [],
          recovery: recovery?.records || [],
          sleep: sleep?.records || [],
          strain: workout?.records || [],
          physiological: physiological?.records || []
        })
        setUsingDemoData(false)
      } else {
        // API call failed, use demo data
        setUsingDemoData(true)
        setWhoopData(generateDemoData())
      }
    } catch (error) {
      console.error('Error loading Whoop data:', error)
      setUsingDemoData(true)
      setWhoopData(generateDemoData())
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    tokenManager.clearTokens()
    setIsAuthenticated(false)
    setUserData(null)
    setUsingDemoData(true)
    setWhoopData(generateDemoData())
  }

  const refreshData = async () => {
    if (isAuthenticated) {
      await loadWhoopData()
    }
  }

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    loading,
    userData,
    whoopData,
    usingDemoData,
    loadWhoopData,
    logout,
    refreshData
  }

  return (
    <WhoopContext.Provider value={value}>
      {children}
    </WhoopContext.Provider>
  )
}
