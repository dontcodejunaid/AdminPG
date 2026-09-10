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
