import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../services/store.js';

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

    // 1. First check admin staff users
    const adminUsers = await store.findAll('adminUsers');
    let user = adminUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (user) {
      const updated = await store.update('adminUsers', user.id, { lastLogin: new Date().toISOString() });
      return res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        token: `keralapg_jwt_${user.id}_${Date.now()}`,
        roleType: 'admin',
        data: updated || user
      });
    }

    // 2. Check customer / seeker registry
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

// POST /api/users/register (User / Seeker Registration)
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

    const newCustomer = {
      id: `cust_${uuidv4().substring(0, 6)}`,
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

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { name, email, role, phone } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, error: 'Name, email and role are required' });
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
      name,
      email,
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
    const ok = await store.delete('adminUsers', req.params.id);
    if (!ok) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
