import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '../utils/whoopApi';

export default function AuthCallback() {
  const [status, setStatus] = useState('processing');
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('AuthCallback: Full URL:', window.location.href);
        console.log('AuthCallback: Search params:', window.location.search);
        
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        console.log('AuthCallback: Code:', code);
        console.log('AuthCallback: Error:', error, errorDescription);

        if (error) {
          console.error('OAuth error from Whoop:', error, errorDescription);
          setStatus('error');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (!code) {
          console.error('No authorization code found in URL');
          setStatus('error');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        console.log('AuthCallback: Exchanging code for token...');
        // Exchange code for token
        await handleOAuthCallback(code);
        
        setStatus('success');
        // Redirect back to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err) {
        console.error('Callback error:', err);
        setStatus('error');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-4xl">💚</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Connecting Whoop...</h1>
            <p className="text-gray-400">Authorizing your account</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✓</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-green-400">Connected!</h1>
            <p className="text-gray-400">Redirecting to dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✕</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-red-400">Connection Failed</h1>
            <p className="text-gray-400">Please try again from Settings</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition"
            >
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
