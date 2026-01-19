'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [emailHistory, setEmailHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Load email history
    loadEmailHistory();
  }, [user, router]);

  const loadEmailHistory = async () => {
    if (!user) return;
    
    setLoadingHistory(true);
    try {
      const response = await fetch(`/api/emails?userId=${user.id}`);
      if (response.ok) {
        const emails = await response.json();
        setEmailHistory(emails);
      }
    } catch (error) {
      console.error('Failed to load email history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.smtpHost) {
      setMessage({ type: 'error', text: 'Please configure your SMTP settings first' });
      return;
    }

    if (!to || !subject || !body) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setSending(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          to,
          subject,
          body,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Email sent successfully!' });
        // Clear form
        setTo('');
        setSubject('');
        setBody('');
        // Reload email history
        loadEmailHistory();
      } else {
        setMessage({ type: 'error', text: `Failed to send: ${data.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send email' });
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  const hasSmtpConfig = user.smtpHost && user.smtpPort && user.smtpUser;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Email Outreach System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user.name} ({user.role})
              </span>
              <Link
                href="/settings"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* SMTP Configuration Warning */}
        {!hasSmtpConfig && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  SMTP Configuration Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>You need to configure your Gmail SMTP settings before you can send emails.</p>
                  <Link
                    href="/settings"
                    className="font-medium underline text-yellow-700 hover:text-yellow-600 mt-1 inline-block"
                  >
                    Go to Settings →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compose Email */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Compose Email
              </h3>

              {message.text && (
                <div
                  className={`rounded-md p-4 mb-4 ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                    To
                  </label>
                  <input
                    type="email"
                    id="to"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="recipient@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email subject"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="body"
                    rows={8}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your email message here..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending || !hasSmtpConfig}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send Email'}
                </button>
              </form>
            </div>
          </div>

          {/* Email History */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Email History
              </h3>

              {loadingHistory ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
              ) : emailHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No emails sent yet
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {emailHistory.map((email) => (
                    <div
                      key={email.id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {email.subject}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            To: {email.to}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(email.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            email.status === 'sent'
                              ? 'bg-green-100 text-green-800'
                              : email.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {email.status}
                        </span>
                      </div>
                      {email.error && (
                        <p className="text-xs text-red-600 mt-2">{email.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
