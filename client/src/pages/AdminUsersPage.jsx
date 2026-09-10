import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  User, 
  Phone, 
  Mail,
  Lock
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const AdminUsersPage = () => {
  const { showToast, currentUser, triggerRefresh } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add User Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff' // 'Super Admin' | 'Admin' | 'Staff'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getUsers();
      if (res.data) setUsers(res.data);
    } catch (err) {
      showToast('Failed to load team members', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Please fill required fields', 'error');
      return;
    }
    try {
      await api.createUser(formData);
      showToast(`Added team member "${formData.name}" as ${formData.role}!`, 'success');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', role: 'Staff' });
      fetchUsers();
      triggerRefresh();
    } catch (err) {
      showToast('Failed to add user', 'error');
    }
  };

  const handleDelete = async (u) => {
    if (!currentUser.permissions.canManageUsers) {
      showToast('Permission Denied: Only Super Admin can manage users', 'error');
      return;
    }
    if (u.role === 'Super Admin') {
      showToast('Cannot delete Primary Super Admin', 'error');
      return;
    }
    if (window.confirm(`Delete user "${u.name}"?`)) {
      try {
        await api.deleteUser(u.id);
        showToast('Team member removed', 'success');
        fetchUsers();
        triggerRefresh();
      } catch (err) {
        showToast('Delete failed', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-purple-600" />
            Admin Users & Role-Based Access Control (Module 15)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage administrative team members and configure granular permissions for Super Admin, Admin, and Staff.
          </p>
        </div>

        {currentUser.permissions.canManageUsers && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Team Member</span>
          </button>
        )}
      </div>

      {/* Role Permission Matrix Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-purple-600" />
          Access Level & Permissions Matrix (Requirement 15)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold">
              <tr>
                <th className="py-2.5 px-3">Role Type</th>
                <th className="py-2.5 px-3">Add PG</th>
                <th className="py-2.5 px-3">Edit PG</th>
                <th className="py-2.5 px-3">Delete PG</th>
                <th className="py-2.5 px-3">Locations/Facilities</th>
                <th className="py-2.5 px-3">Leads CRM</th>
                <th className="py-2.5 px-3">Payments Log</th>
                <th className="py-2.5 px-3">User Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              <tr>
                <td className="py-3 px-3 font-bold text-purple-700 dark:text-purple-300">Super Admin</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-blue-700 dark:text-blue-300">Admin</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-rose-500">❌ No</td>
                <td className="py-3 px-3 text-rose-500">❌ No</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300">Staff</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-amber-600 font-bold">Limited</td>
                <td className="py-3 px-3 text-rose-500">❌ No</td>
                <td className="py-3 px-3 text-rose-500">❌ No</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">✅ Yes</td>
                <td className="py-3 px-3 text-rose-500">❌ No</td>
                <td className="py-3 px-3 text-rose-500">❌ No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map(u => (
          <div
            key={u.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-black text-sm flex items-center justify-center">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{u.name}</h3>
                    <p className="text-[11px] text-slate-400">{u.phone || 'No phone'}</p>
                  </div>
                </div>

                <Badge variant={u.role}>{u.role}</Badge>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{u.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span>Status: <strong className="text-emerald-600">Active</strong></span>
                </div>
              </div>
            </div>

            {currentUser.permissions.canManageUsers && u.role !== 'Super Admin' && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => handleDelete(u)}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove User</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Add Team Member */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Administrative Team Member"
        subtitle="Create login access and assign role permissions"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Operations Staff"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="staff@keralapg.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98470 00000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
            >
              <option value="Staff">Staff (Add/Edit PGs, View Enquiries)</option>
              <option value="Admin">Admin (Full PG ops, Customers & Reports)</option>
              <option value="Super Admin">Super Admin (Unrestricted Full Access)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700"
            >
              Create Team Member
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
