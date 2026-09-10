import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/customers
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let list = await store.findAll('customers');

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
