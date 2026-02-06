import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWhoop } from '../context/WhoopContext'
import { handleOAuthCallback } from '../utils/whoopApi'
import { AlertCircle, CheckCircle } from 'lucide-react'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { setAuthenticated } = useWhoop()
  const [status, setStatus] = useState('processing') // processing, success, error
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get authorization code from URL
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const errorParam = params.get('error')

        if (errorParam) {
          setStatus('error')
          setError(`Whoop authorization failed: ${errorParam}`)
          setTimeout(() => navigate('/whoop'), 3000)
          return
        }

        if (!code) {
          setStatus('error')
          setError('No authorization code received from Whoop')
          setTimeout(() => navigate('/whoop'), 3000)
          return
        }

        // Exchange code for access token
        await handleOAuthCallback(code)
        
        // Update auth state
        setAuthenticated(true)
        
        setStatus('success')
        setError('')
        
        // Redirect after 2 seconds
        setTimeout(() => navigate('/whoop'), 2000)
      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setError(err.message || 'Authentication failed. Please try again.')
        setTimeout(() => navigate('/whoop'), 3000)
      }
    }

    handleCallback()
  }, [navigate, setAuthenticated])

  return (
    <div className="page-container flex items-center justify-center h-screen">
      <div className="text-center max-w-md">
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 border-4 border-whoop-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Bezig met inloggen...</h2>
            <p className="text-gray-400">Je Whoop account wordt verbonden</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-whoop-green mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-whoop-green">Verbonden!</h2>
            <p className="text-gray-400">Je Whoop account is succesvol gekoppeld. Je wordt doorgestuurd...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 text-whoop-red mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-whoop-red">Error</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Je wordt doorgestuurd naar Whoop dashboard...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthCallback
