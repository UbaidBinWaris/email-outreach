'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        className="relative max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Glass morphism card */}
        <motion.div
          className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl" />
          
          <div className="relative p-8 sm:p-10">
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-purple-500/50"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Email Outreach
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                Sign in to access your dashboard
              </p>
            </motion.div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl bg-red-500/20 border border-red-500/50 p-4 backdrop-blur-xl"
                >
                  <div className="text-sm text-red-200">{error}</div>
                </motion.div>
              )}

              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address
                </label>
                <motion.div
                  className="relative group"
                  whileFocus={{ scale: 1.02 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </motion.div>
              </motion.div>

              {/* Password Input */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <motion.div
                  className="relative group"
                  whileFocus={{ scale: 1.02 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </motion.div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex items-center justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                  {!loading && (
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                  {loading && (
                    <motion.div
                      className="ml-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </motion.button>
              </motion.div>

              {/* Credentials Info */}
              <motion.div
                variants={itemVariants}
                className="pt-4 border-t border-white/10"
              >
                <div className="text-xs text-center text-gray-300 space-y-2">
                  <p className="font-medium text-gray-200">Demo Credentials:</p>
                  <div className="space-y-1">
                    <motion.p
                      className="font-mono bg-white/5 rounded-lg py-2 px-3 backdrop-blur-xl border border-white/10"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                      👑 Admin: admin@example.com / admin123
                    </motion.p>
                    <motion.p
                      className="font-mono bg-white/5 rounded-lg py-2 px-3 backdrop-blur-xl border border-white/10"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                      👤 User: user1@example.com / user123
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Bottom glow effect */}
        <motion.div
          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-3/4 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-3xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
}
