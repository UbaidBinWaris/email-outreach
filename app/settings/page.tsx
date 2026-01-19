'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Load existing SMTP config
    if (user.smtpHost) {
      setSmtpHost(user.smtpHost);
      setSmtpPort(user.smtpPort?.toString() || '587');
      setSmtpUser(user.smtpUser || '');
      setSmtpSecure(user.smtpSecure ?? true);
    }
  }, [user, router]);

  const handleTest = async () => {
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setTesting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/users/${user?.id}/smtp/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpHost,
          smtpPort: parseInt(smtpPort),
          smtpUser,
          smtpPassword,
          smtpSecure,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'SMTP configuration is valid! ✓' });
      } else {
        setMessage({ type: 'error', text: `Test failed: ${data.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to test SMTP configuration' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/users/${user?.id}/smtp`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpHost,
          smtpPort: parseInt(smtpPort),
          smtpUser,
          smtpPassword,
          smtpSecure,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'SMTP configuration saved successfully!' });
        updateUser(data.user);
        // Clear password field after save
        setSmtpPassword('');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: `Save failed: ${data.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save SMTP configuration' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              SMTP Gmail Configuration
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Configure your Gmail SMTP settings to send emails. For Gmail, use an App Password instead of your regular password.
            </p>

            {message.text && (
              <div
                className={`rounded-md p-4 mb-6 ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">
                  SMTP Host
                </label>
                <input
                  type="text"
                  id="smtpHost"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div>
                <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                  SMTP Port
                </label>
                <input
                  type="number"
                  id="smtpPort"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  placeholder="587"
                />
              </div>

              <div>
                <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700">
                  Gmail Address
                </label>
                <input
                  type="email"
                  id="smtpUser"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="your-email@gmail.com"
                />
              </div>

              <div>
                <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                  Gmail App Password
                </label>
                <input
                  type="password"
                  id="smtpPassword"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  placeholder="Enter your Gmail App Password"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Generate an App Password at: myaccount.google.com/apppasswords
                </p>
              </div>

              <div className="flex items-center">
                <input
                  id="smtpSecure"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={smtpSecure}
                  onChange={(e) => setSmtpSecure(e.target.checked)}
                />
                <label htmlFor="smtpSecure" className="ml-2 block text-sm text-gray-900">
                  Use TLS/SSL (Recommended)
                </label>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || loading}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading || testing}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">How to get Gmail App Password:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Enable 2-factor authentication on your Google account</li>
            <li>Go to myaccount.google.com/apppasswords</li>
            <li>Create a new App Password for "Mail"</li>
            <li>Copy the generated password and paste it above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
