'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Send, Clock, CheckCircle, AlertCircle, Settings, 
  LogOut, User, Sparkles, TrendingUp, Activity, Inbox
} from 'lucide-react';

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

  // Stats calculation
  const stats = {
    total: emailHistory.length,
    sent: emailHistory.filter(e => e.status === 'sent').length,
    failed: emailHistory.filter(e => e.status === 'failed').length,
    pending: emailHistory.filter(e => e.status === 'pending').length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <motion.nav
        className="relative backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.div
                className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Email Outreach
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20"
                whileHover={{ scale: 1.05 }}
              >
                <User className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-gray-200">{user.name}</span>
                <span className="text-xs text-purple-300">({user.role})</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/settings"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-gray-300 hover:bg-white/20 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
              </motion.div>
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/20 backdrop-blur-xl border border-red-500/50 text-red-300 hover:bg-red-500/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* SMTP Configuration Warning */}
          <AnimatePresence>
            {!hasSmtpConfig && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-500/50 rounded-2xl p-6 flex items-start space-x-4"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-200 mb-2">
                    SMTP Configuration Required
                  </h3>
                  <p className="text-sm text-yellow-100 mb-3">
                    Configure your Gmail SMTP settings to start sending emails.
                  </p>
                  <Link
                    href="/settings"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-yellow-500 text-yellow-900 font-semibold hover:bg-yellow-400 transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Go to Settings</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Emails', value: stats.total, icon: Mail, color: 'from-blue-500 to-cyan-500' },
              { label: 'Sent', value: stats.sent, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
              { label: 'Failed', value: stats.failed, icon: AlertCircle, color: 'from-red-500 to-pink-500' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <motion.p
                      className="text-3xl font-bold text-white mt-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Emails', value: stats.total, icon: Mail, color: 'from-blue-500 to-cyan-500' },
              { label: 'Sent', value: stats.sent, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
              { label: 'Failed', value: stats.failed, icon: AlertCircle, color: 'from-red-500 to-pink-500' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <motion.p
                      className="text-3xl font-bold text-white mt-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compose Email */}
            <motion.div
              variants={itemVariants}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Compose Email</h3>
              </div>

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
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
                      {message.text}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSendEmail} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Recipient
                  </label>
                  <motion.input
                    type="email"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="recipient@example.com"
                    required
                    className="block w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Subject
                  </label>
                  <motion.input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email subject"
                    required
                    className="block w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Message
                  </label>
                  <motion.textarea
                    rows={8}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your email message here..."
                    required
                    className="block w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={sending || !hasSmtpConfig}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50 transition-all"
                  whileHover={!sending && hasSmtpConfig ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!sending && hasSmtpConfig ? { scale: 0.98 } : {}}
                >
                  {sending ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Email</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Email History */}
            <motion.div
              variants={itemVariants}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <Inbox className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Email History</h3>
              </div>

              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-gray-400 mt-4">Loading history...</p>
                </div>
              ) : emailHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-2xl bg-white/5 mb-4">
                    <Mail className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-400">No emails sent yet</p>
                  <p className="text-sm text-gray-500 mt-2">Your email history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence>
                    {emailHistory.map((email, index) => (
                      <motion.div
                        key={email.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate mb-1">
                              {email.subject}
                            </p>
                            <p className="text-sm text-gray-400 truncate flex items-center space-x-2">
                              <Mail className="w-3 h-3" />
                              <span>{email.to}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-2 flex items-center space-x-2">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(email.createdAt).toLocaleString()}</span>
                            </p>
                          </div>
                          <motion.span
                            className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              email.status === 'sent'
                                ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                                : email.status === 'failed'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {email.status === 'sent' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {email.status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                            {email.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {email.status}
                          </motion.span>
                        </div>
                        {email.error && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-xs text-red-400 mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30"
                          >
                            {email.error}
                          </motion.p>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }
      `}</style>
    </div>
  );
}
