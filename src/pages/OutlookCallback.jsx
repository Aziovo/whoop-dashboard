import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { outlookOAuth } from '../utils/emailIntegration';

export default function OutlookCallback() {
  const [status, setStatus] = useState('processing');
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code) {
          setStatus('error');
          return;
        }

        // Parse state
        const parsedState = state ? JSON.parse(decodeURIComponent(state)) : {};

        // Exchange code for token
        await outlookOAuth.exchangeCode(code, parsedState);

        setStatus('success');
        // Redirect back to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err) {
        console.error('Callback error:', err);
        setStatus('error');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-4xl">📧</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Connecting Email...</h1>
            <p className="text-gray-400">Authenticating with Outlook</p>
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
            <p className="text-gray-400">Please try again from the Email tab</p>
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
