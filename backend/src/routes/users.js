import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../services/store.js';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';

const router = express.Router();

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const list = await store.findAll('adminUsers');
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/login (Universal Login for Super Admin, Admin, Staff, and Customer Users)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. If Supabase is configured and password is provided, try Supabase Auth first
    if (isSupabaseConfigured() && supabase && password) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (!authError && authData?.user) {
          // Look up user's profile in DB
          const adminUsers = await store.findAll('adminUsers');
          const user = adminUsers.find(u => u.email.toLowerCase() === cleanEmail);

          if (user) {
            await store.update('adminUsers', user.id, { lastLogin: new Date().toISOString() });
            return res.json({
              success: true,
              message: `Welcome back, ${user.name}! (Authenticated via Supabase)`,
              token: authData.session?.access_token || `keralapg_jwt_${user.id}_${Date.now()}`,
              roleType: 'admin',
              data: user
            });
          }
        }
      } catch (authErr) {
        console.warn('Supabase Auth attempt fallback to database profile check:', authErr.message);
      }
    }

    // 2. Direct Profile Verification (PostgreSQL / Store verification)
    const adminUsers = await store.findAll('adminUsers');
    const user = adminUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (user) {
      const expectedPassword = user.password || user.passwordHash || user.password_hash;
      if (expectedPassword && password && expectedPassword !== password) {
        return res.status(401).json({ success: false, error: 'Incorrect password. Please verify your credentials.' });
      }
      const updated = await store.update('adminUsers', user.id, { lastLogin: new Date().toISOString() });
      return res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        token: `keralapg_jwt_${user.id}_${Date.now()}`,
        roleType: 'admin',
        data: updated || user
      });
    }

    // 3. Check customer / seeker registry
    const customers = await store.findAll('customers');
    let customer = customers.find(c => c.email?.toLowerCase() === cleanEmail || c.phone?.replace(/[^0-9]/g, '') === cleanEmail.replace(/[^0-9]/g, ''));

    if (customer || cleanEmail === 'seeker@keralapg.com' || cleanEmail === 'user@keralapg.com') {
      const customerData = customer || {
        id: `cust_${Date.now()}`,
        name: 'Salih Rahman (PG Seeker)',
        email: cleanEmail,
        phone: '+91 98460 99881',
        city: 'Kochi',
        dateJoined: new Date().toISOString().split('T')[0],
        savedPgs: ['pg_101', 'pg_102'],
        totalEnquiries: 2,
        totalPaid: 19
      };

      return res.json({
        success: true,
        message: `Welcome to KeralaPG Seeker Portal, ${customerData.name}!`,
        token: `keralapg_user_jwt_${customerData.id}_${Date.now()}`,
        roleType: 'customer',
        data: {
          ...customerData,
          role: 'Customer'
        }
      });
    }

    return res.status(401).json({ success: false, error: 'Invalid credentials or user not registered' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/register (Seeker / User Registration)
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || (!email && !phone)) {
      return res.status(400).json({ success: false, error: 'Name and email or phone number are required' });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPhone = phone ? phone.trim() : '';

    const customers = await store.findAll('customers');
    const existing = customers.find(c => 
      (cleanEmail && c.email?.toLowerCase() === cleanEmail) || 
      (cleanPhone && c.phone === cleanPhone)
    );

    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email/phone already exists. Please sign in.' });
    }

    // Try creating user in Supabase Auth if configured
    let authUserId = null;
    if (isSupabaseConfigured() && supabase && cleanEmail && password) {
      try {
        const { data: authData } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { name: name.trim(), phone: cleanPhone, role: 'Seeker' }
          }
        });
        authUserId = authData?.user?.id || null;
      } catch (authErr) {
        console.warn('Supabase Auth signup skipped:', authErr.message);
      }
    }

    const newCustomer = {
      id: `cust_${uuidv4().substring(0, 6)}`,
      authUserId,
      name: name.trim(),
      email: cleanEmail || `${cleanPhone.replace(/[^0-9]/g, '')}@keralapg.com`,
      phone: cleanPhone || '+91 98470 00000',
      city: req.body.city || 'Kochi',
      dateJoined: new Date().toISOString().split('T')[0],
      savedPgs: [],
      totalEnquiries: 0,
      totalPaid: 0,
      role: 'Customer'
    };

    const created = await store.create('customers', newCustomer);
    res.status(201).json({
      success: true,
      message: `Account created successfully! Welcome to KeralaPG, ${name}!`,
      token: `keralapg_user_jwt_${created.id}_${Date.now()}`,
      roleType: 'customer',
      data: created
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/oauth-sync (Unified login for Google OAuth / Email matching)
router.post('/oauth-sync', async (req, res) => {
  try {
    const { email, name, avatar, authUserId } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if an Admin / Super Admin / Staff user matches this email (or if this is baigjunaid187@gmail.com)
    const adminUsers = await store.findAll('adminUsers');
    let adminUser = adminUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!adminUser && cleanEmail === 'baigjunaid187@gmail.com') {
      const superAdminProfile = {
        id: `usr_super_${uuidv4().substring(0, 6)}`,
        authUserId: authUserId || null,
        name: name?.trim() || 'Junaid Baig',
        email: 'baigjunaid187@gmail.com',
        role: 'Super Admin',
        phone: req.body.phone || '+91 98470 11111',
        avatar: avatar || '',
        status: 'Active',
        lastLogin: new Date().toISOString(),
        permissions: {
          canAddPG: true,
          canEditPG: true,
          canDeletePG: true,
          canVerifyPG: true,
          canManageLocations: true,
          canManageFacilities: true,
          canManageEnquiries: true,
          canManageCustomers: true,
          canModerateReports: true,
          canManagePayments: true,
          canManageCMS: true,
          canManageBanners: true,
          canManageUsers: true
        }
      };
      adminUser = await store.create('adminUsers', superAdminProfile);
    }

    if (adminUser) {
      const updated = await store.update('adminUsers', adminUser.id, {
        lastLogin: new Date().toISOString(),
        ...(name && adminUser.name === 'Super Admin' ? { name } : {}),
        ...(avatar && !adminUser.avatar ? { avatar } : {})
      });
      return res.json({
        success: true,
        message: `Welcome back, ${adminUser.name}!`,
        token: `keralapg_jwt_${adminUser.id}_${Date.now()}`,
        roleType: 'admin',
        data: updated || adminUser
      });
    }

    // 2. Check if a Customer / Seeker matches this email
    const customers = await store.findAll('customers');
    const customer = customers.find(c => c.email?.toLowerCase() === cleanEmail);

    if (customer) {
      return res.json({
        success: true,
        message: `Welcome back, ${customer.name}!`,
        token: `keralapg_user_jwt_${customer.id}_${Date.now()}`,
        roleType: 'customer',
        data: {
          ...customer,
          role: 'Customer'
        }
      });
    }

    // 3. New User: Provision a new customer profile automatically
    const newCustomer = {
      id: `cust_${uuidv4().substring(0, 6)}`,
      authUserId: authUserId || null,
      name: name?.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: req.body.phone || '',
      avatar: avatar || '',
      city: 'Kochi',
      dateJoined: new Date().toISOString().split('T')[0],
      savedPgs: [],
      totalEnquiries: 0,
      totalPaid: 0,
      role: 'Customer'
    };

    const created = await store.create('customers', newCustomer);
    return res.status(201).json({
      success: true,
      message: `Welcome to KeralaPG, ${newCustomer.name}!`,
      token: `keralapg_user_jwt_${created.id}_${Date.now()}`,
      roleType: 'customer',
      data: created
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users (Super Admin adds Admin or Staff user)
router.post('/', async (req, res) => {
  try {
    const { name, email, role, phone, password } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, error: 'Name, email and role are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const assignedPassword = password || 'KeralaPG@123';

    // Optional Supabase Auth user provisioning
    let authUserId = null;
    if (isSupabaseConfigured() && supabase && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data: authUser } = await supabase.auth.admin.createUser({
          email: cleanEmail,
          password: assignedPassword,
          email_confirm: true,
          user_metadata: { name: name.trim(), role }
        });
        authUserId = authUser?.user?.id || null;
      } catch (authErr) {
        console.warn('Supabase admin.createUser warning:', authErr.message);
      }
    }

    const defaultPermissions = {
      "Super Admin": {
        canAddPG: true,
        canEditPG: true,
        canDeletePG: true,
        canVerifyPG: true,
        canManageLocations: true,
        canManageFacilities: true,
        canManageEnquiries: true,
        canManageCustomers: true,
        canModerateReports: true,
        canManagePayments: true,
        canManageCMS: true,
        canManageBanners: true,
        canManageUsers: true
      },
      "Admin": {
        canAddPG: true,
        canEditPG: true,
        canDeletePG: true,
        canVerifyPG: true,
        canManageLocations: true,
        canManageFacilities: true,
        canManageEnquiries: true,
        canManageCustomers: true,
        canModerateReports: true,
        canManagePayments: false,
        canManageCMS: true,
        canManageBanners: true,
        canManageUsers: false
      },
      "Staff": {
        canAddPG: true,
        canEditPG: true,
        canDeletePG: false,
        canVerifyPG: false,
        canManageLocations: false,
        canManageFacilities: false,
        canManageEnquiries: true,
        canManageCustomers: false,
        canModerateReports: false,
        canManagePayments: false,
        canManageCMS: false,
        canManageBanners: false,
        canManageUsers: false
      }
    };

    const newUser = {
      id: `usr_${uuidv4().substring(0, 6)}`,
      authUserId,
      name: name.trim(),
      email: cleanEmail,
      password: assignedPassword,
      passwordHash: assignedPassword,
      role,
      phone: phone || '',
      status: 'Active',
      lastLogin: new Date().toISOString(),
      permissions: req.body.permissions || defaultPermissions[role] || defaultPermissions['Staff']
    };

    const created = await store.create('adminUsers', newUser);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/change-password (User updates or sets their own password)
router.post('/change-password', async (req, res) => {
  try {
    const { userId, email, currentPassword, newPassword } = req.body;
    if ((!userId && !email) || !newPassword) {
      return res.status(400).json({ success: false, error: 'User identifier and new password are required' });
    }
    if (newPassword.length < 4) {
      return res.status(400).json({ success: false, error: 'New password must be at least 4 characters' });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // Search in adminUsers
    const adminUsers = await store.findAll('adminUsers');
    let user = adminUsers.find(u => (userId && u.id === userId) || (cleanEmail && u.email.toLowerCase() === cleanEmail));
    let collection = 'adminUsers';

    if (!user) {
      const customers = await store.findAll('customers');
      user = customers.find(c => (userId && c.id === userId) || (cleanEmail && c.email?.toLowerCase() === cleanEmail));
      collection = 'customers';
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found' });
    }

    const existingPassword = user.password || user.passwordHash || user.password_hash;

    // If account already has a password, verify current password
    if (existingPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, error: 'Current password is required to change your existing password.' });
      }
      if (existingPassword !== currentPassword) {
        return res.status(400).json({ success: false, error: 'Current password is incorrect.' });
      }
    }

    // If Supabase is configured and authUserId exists, update Supabase Auth password
    if (isSupabaseConfigured() && supabase && user.authUserId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabase.auth.admin.updateUserById(user.authUserId, { password: newPassword });
      } catch (authErr) {
        console.warn('Supabase auth password update error:', authErr.message);
      }
    }

    const updated = await store.update(collection, user.id, {
      password: newPassword,
      passwordHash: newPassword,
      passwordLastChanged: new Date().toISOString()
    });

    res.json({
      success: true,
      message: existingPassword 
        ? 'Password changed successfully! Keep your new credentials safe.' 
        : 'Password created successfully! You can now log in using email & password or Google.',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/reset-password (Super Admin resets someone's password)
router.post('/reset-password', async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) {
      return res.status(400).json({ success: false, error: 'User ID and new password are required' });
    }

    const adminUsers = await store.findAll('adminUsers');
    const user = adminUsers.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (isSupabaseConfigured() && supabase && user.authUserId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabase.auth.admin.updateUserById(user.authUserId, { password: newPassword });
      } catch (authErr) {
        console.warn('Supabase auth password update error:', authErr.message);
      }
    }

    const updated = await store.update('adminUsers', userId, {
      password: newPassword,
      passwordHash: newPassword,
      passwordLastChanged: new Date().toISOString()
    });

    res.json({ success: true, message: `Password reset successfully for ${updated.name}`, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await store.update('adminUsers', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const user = await store.findById('adminUsers', req.params.id);
    if (user && isSupabaseConfigured() && supabase && user.authUserId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await supabase.auth.admin.deleteUser(user.authUserId);
      } catch (authErr) {
        console.warn('Supabase auth user deletion error:', authErr.message);
      }
    }
    const ok = await store.delete('adminUsers', req.params.id);
    if (!ok) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
