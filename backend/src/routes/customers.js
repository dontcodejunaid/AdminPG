import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/customers
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const [customersList, profilesList] = await Promise.all([
      store.findAll('customers'),
      store.findAll('adminUsers')
    ]);

    const seekerProfiles = (profilesList || []).filter(
      p => p.role === 'Seeker' || p.role === 'Customer'
    );

    // Merge seeker profiles that are not yet in customers list by email or phone
    const mergedMap = new Map();

    (customersList || []).forEach(c => {
      const key = (c.email || c.phone || c.id).toLowerCase();
      mergedMap.set(key, c);
    });

    seekerProfiles.forEach(sp => {
      const key = (sp.email || sp.phone || sp.id).toLowerCase();
      if (!mergedMap.has(key)) {
        mergedMap.set(key, {
          id: sp.id,
          name: sp.name || 'Seeker',
          email: sp.email || '',
          phone: sp.phone || 'No phone',
          city: sp.city || 'Kerala',
          dateJoined: sp.createdAt ? sp.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          savedPgs: sp.savedPgs || [],
          unlockedPgs: sp.unlockedPgs || [],
          totalEnquiries: sp.totalEnquiries || 0,
          totalPaid: sp.totalPaid || 0,
          role: sp.role
        });
      }
    });

    let list = Array.from(mergedMap.values());

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/customers
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const newCust = {
      id: `cust_${Date.now()}`,
      name: payload.name,
      phone: payload.phone,
      email: payload.email || '',
      city: payload.city || '',
      dateJoined: new Date().toISOString().split('T')[0],
      savedPgs: payload.savedPgs || [],
      totalEnquiries: 0,
      totalPaid: 0
    };

    const created = await store.create('customers', newCust);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', async (req, res) => {
  try {
    const ok = await store.delete('customers', req.params.id);
    if (!ok) return res.status(404).json({ success: false, error: 'Customer not found' });
    res.json({ success: true, message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
