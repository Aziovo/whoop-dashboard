import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, LogIn, RefreshCw, Inbox } from 'lucide-react';
import { emailManager, outlookOAuth, emailSync } from '../utils/emailIntegration';

const EmailPanel = () => {
  const [emails, setEmails] = useState([]);
  const [authenticatedAccounts, setAuthenticatedAccounts] = useState({});
  const [syncingaccount, setSyncingAccount] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const accounts = [
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'business_info', label: 'Business (Info)', icon: '💼' },
    { id: 'business_accounting', label: 'Business (Accounting)', icon: '📊' },
    { id: 'school', label: 'School', icon: '🎓' }
  ];

  useEffect(() => {
    // Check authentication status for all accounts
    const status = {};
    accounts.forEach(acc => {
      status[acc.id] = outlookOAuth.isAuthenticated(acc.id);
    });
    setAuthenticatedAccounts(status);

    // Load emails
    const stored = emailManager.getEmails();
    setEmails(stored);
    setUnreadCount(emailManager.getUnreadCount());

    // Start auto-sync if any account is authenticated
    if (Object.values(status).some(v => v)) {
      emailSync.start();
    }

    return () => emailSync.stop();
  }, []);

  const handleConnect = (accountId) => {
    outlookOAuth.initiateAuth(accountId);
  };

  const handleSync = async (accountId) => {
    setSyncingAccount(accountId);
    try {
      const newEmails = await outlookOAuth.getEmails(accountId, 20);
      newEmails.forEach(email => {
        emailManager.addEmail({
          id: email.id,
          account: accountId,
          from: email.from?.emailAddress?.address,
          subject: email.subject,
          preview: email.bodyPreview,
          date: email.receivedDateTime,
          read: email.isRead,
          hasAttachments: email.hasAttachments
        });
      });

      // Update UI
      setEmails(emailManager.getEmails());
      setUnreadCount(emailManager.getUnreadCount());
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setSyncingAccount(null);
    }
  };

  const handleDisconnect = (accountId) => {
    outlookOAuth.logout(accountId);
    const status = { ...authenticatedAccounts };
    status[accountId] = false;
    setAuthenticatedAccounts(status);
    setEmails(emailManager.getEmails());
  };

  const accountEmails = (accountId) => {
    return emails.filter(e => e.account === accountId);
  };

  return (
    <div className="space-y-6">
      {/* Email Stats */}
      <motion.div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Total Emails</span>
          </div>
          <p className="text-2xl font-bold">{emails.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Unread</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{unreadCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Inbox className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Connected</span>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {Object.values(authenticatedAccounts).filter(Boolean).length}/4
          </p>
        </div>
      </motion.div>

      {/* Account Connectors */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
          Connected Accounts
        </h3>
        <div className="space-y-3">
          {accounts.map(account => (
            <motion.div
              key={account.id}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition"
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-xl">{account.icon}</span>
                <div>
                  <p className="text-sm font-medium">{account.label}</p>
                  <p className="text-xs text-gray-400">
                    {authenticatedAccounts[account.id] 
                      ? `${accountEmails(account.id).length} emails`
                      : 'Not connected'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {authenticatedAccounts[account.id] ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSync(account.id)}
                      disabled={syncingaccount === account.id}
                      className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition disabled:opacity-50"
                      title="Sync emails"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${syncingaccount === account.id ? 'animate-spin' : ''}`}
                      />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDisconnect(account.id)}
                      className="px-3 py-2 text-xs bg-red-500 hover:bg-red-600 rounded-lg transition"
                    >
                      Disconnect
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleConnect(account.id)}
                    className="flex items-center space-x-2 px-3 py-2 text-xs bg-cyan-500 hover:bg-cyan-600 rounded-lg transition"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Connect</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Emails */}
      {emails.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Recent Emails
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {emails.slice(0, 20).map(email => (
              <motion.div
                key={email.id}
                className={`p-3 rounded-lg border ${
                  email.read
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-800 border-cyan-500'
                }`}
                whileHover={{ x: 2 }}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-white truncate">{email.subject}</p>
                  {email.hasAttachments && <span className="text-xs">📎</span>}
                </div>
                <p className="text-xs text-gray-400 truncate">{email.from}</p>
                <p className="text-xs text-gray-500 mt-1">{email.preview}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No Emails */}
      {emails.length === 0 && Object.values(authenticatedAccounts).some(v => v) && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <Mail className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No emails synced yet. Click refresh to sync.</p>
        </div>
      )}
    </div>
  );
};

export default EmailPanel;
