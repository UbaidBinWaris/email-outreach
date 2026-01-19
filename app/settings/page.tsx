'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Mail, Key, Shield, CheckCircle, AlertCircle, ArrowLeft, Zap, Settings } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(false);
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
      const port = user.smtpPort?.toString() || '587';
      setSmtpHost(user.smtpHost);
      setSmtpPort(port);
      setSmtpUser(user.smtpUser || '');
      // Force correct secure setting based on port
      setSmtpSecure(port === '465' ? true : false);
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="max-w-3xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-500/50"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Settings className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  SMTP Configuration
                </h1>
                <p className="text-gray-400 mt-1">Configure your Gmail settings for sending emails</p>
              </div>
            </div>
            <motion.button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-gray-300 hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <div className="p-8 sm:p-10">
            {/* Success/Error Message */}
            <AnimatePresence mode="wait">
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`rounded-2xl p-4 mb-6 flex items-center space-x-3 backdrop-blur-xl ${
                    message.type === 'success'
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-red-500/20 border border-red-500/50'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <span className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
                    {message.text}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              {/* SMTP Host */}
              <motion.div variants={itemVariants}>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-200 mb-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  <span>SMTP Host</span>
                </label>
                <motion.input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="block w-full px-4 py-3.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              {/* SMTP Port */}
              <motion.div variants={itemVariants}>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-200 mb-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>SMTP Port</span>
                </label>
                <select
                  value={smtpPort}
                  onChange={(e) => {
                    const port = e.target.value;
                    setSmtpPort(port);
                    setSmtpSecure(port === '465');
                  }}
                  className="block w-full px-4 py-3.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 cursor-pointer"
                >
                  <option value="587" className="bg-slate-900">587 (STARTTLS - Recommended)</option>
                  <option value="465" className="bg-slate-900">465 (SSL/TLS)</option>
                </select>
                <p className="mt-2 text-xs text-gray-400 flex items-center space-x-1">
                  <span className="inline-block w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  <span>Port 587: STARTTLS (SSL/TLS unchecked) • Port 465: SSL/TLS (checked)</span>
                </p>
              </motion.div>

              {/* Gmail Address */}
              <motion.div variants={itemVariants}>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-200 mb-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>Gmail Address</span>
                </label>
                <motion.input
                  type="email"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="block w-full px-4 py-3.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              {/* Gmail App Password */}
              <motion.div variants={itemVariants}>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-200 mb-2">
                  <Key className="w-4 h-4 text-purple-400" />
                  <span>Gmail App Password</span>
                </label>
                <motion.input
                  type="password"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  placeholder="Enter your 16-character App Password"
                  className="block w-full px-4 py-3.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  whileFocus={{ scale: 1.01 }}
                />
                <p className="mt-2 text-xs text-blue-400">
                  Generate at:{' '}
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-300"
                  >
                    myaccount.google.com/apppasswords
                  </a>
                </p>
              </motion.div>

              {/* SSL/TLS Toggle */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-200">Use SSL/TLS</p>
                    <p className="text-xs text-gray-400">Only for port 465</p>
                  </div>
                </div>
                <motion.button
                  type="button"
                  onClick={() => setSmtpSecure(!smtpSecure)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    smtpSecure ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-600'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg"
                    animate={{
                      x: smtpSecure ? 28 : 0
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </motion.div>

              {/* Info Box */}
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30"
              >
                <h4 className="text-sm font-semibold text-blue-300 mb-2">📘 Gmail Configuration Guide:</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Port 587: Leave SSL/TLS <strong>unchecked</strong> (uses STARTTLS)</li>
                  <li>• Port 465: Check SSL/TLS box</li>
                  <li>• Enable 2-factor authentication first</li>
                  <li>• Create App Password under Google Account settings</li>
                </ul>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <motion.button
                type="button"
                onClick={handleTest}
                disabled={testing || loading}
                className="flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-semibold bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {testing ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Test Connection</span>
                  </>
                )}
              </motion.button>
              
              <motion.button
                type="button"
                onClick={handleSave}
                disabled={loading || testing}
                className="flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Save Configuration</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Instructions Card */}
        <motion.div
          variants={itemVariants}
          className="mt-6 backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/30"
          whileHover={{ scale: 1.01 }}
        >
          <h4 className="text-sm font-bold text-blue-300 mb-3 flex items-center space-x-2">
            <Key className="w-4 h-4" />
            <span>How to get Gmail App Password:</span>
          </h4>
          <ol className="text-sm text-gray-300 space-y-2">
            {[
              'Enable 2-factor authentication on your Google account',
              'Go to myaccount.google.com/apppasswords',
              'Create a new App Password for "Mail"',
              'Copy the 16-character password and paste it above'
            ].map((step, index) => (
              <motion.li
                key={index}
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span>{step}</span>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </motion.div>
    </div>
  );
}
