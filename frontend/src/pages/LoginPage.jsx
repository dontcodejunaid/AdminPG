import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  Moon, 
  Sun,
  Check,
  AlertCircle,
  HelpCircle,
  Building2,
  User,
  Users
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';

export const LoginPage = () => {
  const { login, darkMode, setDarkMode, showToast } = useApp();
  
  const [email, setEmail] = useState('superadmin@keralapg.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // 1-Click Demo Accounts across all 4 roles
  const demoAccounts = [
    {
      role: 'Super Admin',
      name: 'Junaid (Super Admin)',
      email: 'superadmin@keralapg.com',
      desc: 'Full access to properties, settings, payments & users',
      type: 'Admin Dashboard'
    },
    {
      role: 'Admin',
      name: 'Operations Manager',
      email: 'admin@keralapg.com',
      desc: 'Properties, leads CRM, locations & CMS',
      type: 'Admin Dashboard'
    },
    {
      role: 'Staff',
      name: 'Field Executive',
      email: 'staff@keralapg.com',
      desc: 'Add & edit properties, review incoming leads',
      type: 'Staff Portal'
    },
    {
      role: 'PG Seeker',
      name: 'Salih Rahman (User)',
      email: 'salih.rahman@gmail.com',
      desc: 'Saved Wishlists, Inquiries & ₹19 Unlocks',
      type: 'Seeker Portal'
    }
  ];

  const handleQuickFill = (acc) => {
    setEmail(acc.email);
    setPassword('password123');
    setErrorMessage('');
    showToast(`Selected ${acc.role} (${acc.type})`, 'info');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email or registered phone number');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.login({ email, password });
      if (res.success && res.data) {
        login(res.data, res.token);
      } else {
        setErrorMessage(res.error || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    showToast(`Password reset link sent to ${recoveryEmail}`, 'success');
    setForgotModalOpen(false);
    setRecoveryEmail('');
  };

  // Determine current role badge based on selected email
  const currentDemoAcc = demoAccounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-brand-500 selection:text-white">
      
      {/* Decorative Heritage Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-brand-600/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-600/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Top Bar: Dark Mode Switcher */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 p-1 flex items-center justify-center shadow-md border border-slate-200 dark:border-slate-800">
            <img src="/logo.png" alt="KeralaPG Emblem" className="h-full w-full object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              Kerala<span className="text-amber-500 font-black">PG</span>
            </span>
            <span className="text-[10px] ml-1.5 uppercase font-black px-1.5 py-0.5 rounded bg-brand-100 text-brand-900 dark:bg-brand-950 dark:text-brand-300">
              Universal Portal
            </span>
          </div>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </header>

      {/* Main Login Card Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg space-y-5">
          
          {/* Card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl space-y-6">
            
            {/* Header with Emblem */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 p-1.5 mx-auto flex items-center justify-center shadow-lg border border-brand-200/60 dark:border-slate-700">
                <img
                  src="/logo.png"
                  alt="KeralaPG Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
                KeralaPG Access Portal
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Sign in to your account. You will automatically be routed to the appropriate dashboard based on your role.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email / Phone Number
                  </label>
                  {currentDemoAcc && (
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">
                      Target: {currentDemoAcc.type}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@keralapg.com or phone number"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-brand-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-brand-500 focus:outline-none transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Keep me signed in
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-xs shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to {currentDemoAcc ? currentDemoAcc.type : 'Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Role Login Selector */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  1-Click Role Login
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Auto Route by Role</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {demoAccounts.map(acc => {
                  const isCurrent = email.toLowerCase() === acc.email.toLowerCase();
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleQuickFill(acc)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isCurrent 
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 font-bold shadow-sm' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {acc.role}
                      </p>
                      <p className="text-[10px] text-brand-600 dark:text-brand-400 truncate mt-0.5 font-semibold">
                        {acc.type}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Security Guarantee Tag */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>256-Bit SSL Encrypted • Role-Based Access Enforced</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} KeralaPG.com • All Rights Reserved
      </footer>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Password"
        subtitle="Enter your registered email or phone to receive a recovery link"
      >
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Registered Email Address *
            </label>
            <input
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="name@keralapg.com"
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="px-4 py-2 text-xs rounded-xl text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl shadow-md"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
