/**
 * Email Integration - Outlook + Gmail Support
 * Syncs emails from all configured accounts
 */

export const emailManager = {
  // Store emails in localStorage
  getEmails: () => JSON.parse(localStorage.getItem('user_emails') || '[]'),
  setEmails: (emails) => localStorage.setItem('user_emails', JSON.stringify(emails)),
  addEmail: (email) => {
    const emails = emailManager.getEmails();
    emails.unshift(email); // Add to front
    if (emails.length > 100) emails.pop(); // Keep last 100
    emailManager.setEmails(emails);
  },
  clearEmails: () => localStorage.removeItem('user_emails'),

  // Filter by account
  getEmailsByAccount: (accountEmail) => {
    return emailManager.getEmails().filter(e => e.from === accountEmail || e.account === accountEmail);
  },

  // Get unread count
  getUnreadCount: () => {
    return emailManager.getEmails().filter(e => !e.read).length;
  },

  // Get today's emails
  getTodayEmails: () => {
    const today = new Date().toISOString().split('T')[0];
    return emailManager.getEmails().filter(e => e.date?.startsWith(today));
  },

  // Mark as read
  markAsRead: (emailId) => {
    const emails = emailManager.getEmails();
    const email = emails.find(e => e.id === emailId);
    if (email) {
      email.read = true;
      emailManager.setEmails(emails);
    }
  }
};

/**
 * Outlook OAuth - Connect all 4 accounts
 */
export const outlookOAuth = {
  // Outlook OAuth endpoints
  authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  
  // Configure these in Vercel env vars
  clientId: import.meta.env.VITE_OUTLOOK_CLIENT_ID,
  clientSecret: import.meta.env.VITE_OUTLOOK_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_OUTLOOK_REDIRECT_URI || 'http://localhost:3000/auth/outlook',

  scopes: [
    'Mail.Read',
    'Mail.Read.Shared',
    'offline_access'
  ],

  // Start OAuth flow for Outlook
  initiateAuth: (account = 'personal') => {
    const params = new URLSearchParams({
      client_id: outlookOAuth.clientId,
      response_type: 'code',
      redirect_uri: outlookOAuth.redirectUri,
      scope: outlookOAuth.scopes.join(' '),
      state: JSON.stringify({ account, timestamp: Date.now() }),
      prompt: 'select_account' // Let user pick which account
    });

    window.location.href = `${outlookOAuth.authUrl}?${params.toString()}`;
  },

  // Exchange code for token
  exchangeCode: async (code, state) => {
    try {
      const response = await fetch('/api/outlook/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state })
      });

      if (!response.ok) throw new Error('Token exchange failed');
      
      const tokenData = await response.json();
      
      // Store token
      const tokens = JSON.parse(localStorage.getItem('outlook_tokens') || '{}');
      tokens[state.account] = tokenData;
      localStorage.setItem('outlook_tokens', JSON.stringify(tokens));

      return tokenData;
    } catch (err) {
      console.error('Outlook token exchange error:', err);
      throw err;
    }
  },

  // Get emails for account
  getEmails: async (account = 'personal', limit = 50) => {
    const tokens = JSON.parse(localStorage.getItem('outlook_tokens') || '{}');
    const token = tokens[account];

    if (!token || !token.access_token) {
      throw new Error(`Not authenticated for ${account}`);
    }

    try {
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=${limit}&$orderby=receivedDateTime%20desc`, {
        headers: {
          'Authorization': `Bearer ${token.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          await outlookOAuth.refreshToken(account);
          return outlookOAuth.getEmails(account, limit);
        }
        throw new Error(`Outlook API error: ${response.status}`);
      }

      const data = await response.json();
      return data.value || [];
    } catch (err) {
      console.error('Error fetching Outlook emails:', err);
      throw err;
    }
  },

  // Refresh token
  refreshToken: async (account = 'personal') => {
    const tokens = JSON.parse(localStorage.getItem('outlook_tokens') || '{}');
    const token = tokens[account];

    if (!token?.refresh_token) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('/api/outlook/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          refresh_token: token.refresh_token,
          account 
        })
      });

      if (!response.ok) throw new Error('Token refresh failed');
      
      const newToken = await response.json();
      tokens[account] = newToken;
      localStorage.setItem('outlook_tokens', JSON.stringify(tokens));

      return newToken;
    } catch (err) {
      console.error('Token refresh error:', err);
      throw err;
    }
  },

  // Check if authenticated for account
  isAuthenticated: (account = 'personal') => {
    const tokens = JSON.parse(localStorage.getItem('outlook_tokens') || '{}');
    return !!(tokens[account]?.access_token);
  },

  // Logout
  logout: (account = 'personal') => {
    const tokens = JSON.parse(localStorage.getItem('outlook_tokens') || '{}');
    delete tokens[account];
    localStorage.setItem('outlook_tokens', JSON.stringify(tokens));
  }
};

/**
 * Email Sync - Auto-sync emails periodically
 */
export const emailSync = {
  syncInterval: null,

  start: async () => {
    // Initial sync
    await emailSync.syncAll();

    // Then every 5 minutes
    emailSync.syncInterval = setInterval(emailSync.syncAll, 5 * 60 * 1000);
  },

  stop: () => {
    if (emailSync.syncInterval) {
      clearInterval(emailSync.syncInterval);
      emailSync.syncInterval = null;
    }
  },

  syncAll: async () => {
    const accounts = ['personal', 'business_info', 'business_accounting', 'school'];
    
    for (const account of accounts) {
      if (outlookOAuth.isAuthenticated(account)) {
        try {
          const emails = await outlookOAuth.getEmails(account, 20);
          emails.forEach(email => {
            emailManager.addEmail({
              id: email.id,
              account,
              from: email.from?.emailAddress?.address,
              subject: email.subject,
              preview: email.bodyPreview,
              date: email.receivedDateTime,
              read: email.isRead,
              hasAttachments: email.hasAttachments
            });
          });
        } catch (err) {
          console.error(`Sync failed for ${account}:`, err);
        }
      }
    }
  }
};
