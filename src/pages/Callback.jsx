import React, { useEffect, useState } from 'react';
import { whoopApi } from '../utils/whoopApi';

export const Callback = () => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code) {
          setError('Geen autorisatiecode ontvangen. Raadpleeg de Whoop documentatie.');
          setStatus('error');
          return;
        }

        // Exchange code for tokens
        await whoopApi.exchangeCodeForToken(code);
        setStatus('success');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (err) {
        console.error('OAuth Error:', err);
        setError(err.message || 'Er is een fout opgetreden bij het verwerken van OAuth');
        setStatus('error');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <div className="mb-4 text-6xl animate-spin">⏳</div>
            <p className="text-2xl font-bold mb-2">Autorisatie verwerken...</p>
            <p className="text-gray-400">Je Whoop account wordt verbonden</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="mb-4 text-6xl">✅</div>
            <p className="text-2xl font-bold mb-2 text-whoop-green">Succesvol verbonden!</p>
            <p className="text-gray-400">Je wordt doorgestuurd naar je dashboard...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="mb-4 text-6xl">❌</div>
            <p className="text-2xl font-bold mb-2 text-whoop-red">Fout bij autorisatie</p>
            <p className="text-gray-400 mb-4">{error}</p>
            <a href="/" className="text-whoop-green hover:text-emerald-400">
              Terug naar dashboard
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Callback;
