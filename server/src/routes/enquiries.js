import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/enquiries
router.get('/', async (req, res) => {
  try {
    const { status, pgId, search } = req.query;
    let list = await store.findAll('enquiries');

    if (status) list = list.filter(e => e.status?.toLowerCase() === status.toLowerCase());
    if (pgId) list = list.filter(e => e.pgId === pgId);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.customerName?.toLowerCase().includes(q) ||
        e.customerPhone?.includes(q) ||
        e.pgName?.toLowerCase().includes(q) ||
        e.customerEmail?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/enquiries
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const newEnquiry = {
      id: `enq_${Date.now()}`,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail || '',
      pgId: payload.pgId,
      pgName: payload.pgName || 'PG Accommodation',
      roomType: payload.roomType || 'Standard',
      budget: payload.budget || '',
      moveInDate: payload.moveInDate || '',
      message: payload.message || '',
      status: payload.status || 'New', // New, Contacted, Interested, Visited, Closed
      adminNotes: payload.adminNotes || '',
      source: payload.source || 'Admin Direct',
      createdAt: new Date().toISOString()
    };

    const created = await store.create('enquiries', newEnquiry);

    // Also push notification
    await store.create('notifications', {
      id: `notif_${Date.now()}`,
      type: 'enquiry',
      title: 'New Enquiry Added',
      message: `${newEnquiry.customerName} enquiry for ${newEnquiry.pgName}`,
      timestamp: new Date().toISOString(),
      read: false,
      link: '/enquiries'
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/enquiries/:id/status (Change lead status & admin notes)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const patch = {};
    if (status) patch.status = status;
    if (adminNotes !== undefined) patch.adminNotes = adminNotes;

    const updated = await store.update('enquiries', req.params.id, patch);
    if (!updated) return res.status(404).json({ success: false, error: 'Enquiry not found' });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/enquiries/:id
router.delete('/:id', async (req, res) => {
  try {
    const ok = await store.delete('enquiries', req.params.id);
    if (!ok) return res.status(404).json({ success: false, error: 'Enquiry not found' });
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
