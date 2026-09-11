import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { currentUser, showToast, login } = useApp();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user has an existing password or is setting one for the first time
  const hasExistingPassword = Boolean(currentUser?.password || currentUser?.passwordHash || currentUser?.password_hash);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (hasExistingPassword && !currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setError('New password must be at least 4 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.changePassword({
        userId: currentUser.id,
        email: currentUser.email,
        currentPassword: hasExistingPassword ? currentPassword : null,
        newPassword
      });

      if (res?.data) {
        // Update user state so hasExistingPassword is now true
        login({ ...currentUser, ...res.data, password: newPassword });
      }

      showToast(
        hasExistingPassword 
          ? 'Password changed successfully! Keep your new credentials safe.' 
          : 'Password set successfully! You can now sign in using your email & password or Google.', 
        'success'
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update password');
      showToast(err.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={hasExistingPassword ? "Change Your Password" : "Set Account Password"}
      subtitle={
        hasExistingPassword
          ? `Update your login password for ${currentUser?.name || 'your account'} (${currentUser?.role || 'Staff'})`
          : `Create a password to enable direct email & password sign-in for ${currentUser?.name || 'your account'}`
      }
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Current Password (Only shown if user already has a password set) */}
        {hasExistingPassword && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2 pr-10 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required={hasExistingPassword}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {hasExistingPassword ? "New Password" : "Create Password"}
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 4 characters"
              className="w-full px-3 py-2 pr-10 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {hasExistingPassword ? "Confirm New Password" : "Confirm Password"}
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className={`w-full px-3 py-2 pr-10 text-xs rounded-xl border bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 ${
                confirmPassword && !passwordsMatch
                  ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-brand-500'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {passwordsMatch && (
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Passwords match
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>
              {loading 
                ? (hasExistingPassword ? 'Updating...' : 'Setting Password...') 
                : (hasExistingPassword ? 'Update Password' : 'Set Password')}
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
