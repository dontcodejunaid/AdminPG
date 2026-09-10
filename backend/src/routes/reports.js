import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let list = await store.findAll('reportedListings');

    if (status) list = list.filter(r => r.status?.toLowerCase() === status.toLowerCase());

    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reports
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const newReport = {
      id: `rep_${Date.now()}`,
      pgId: payload.pgId,
      pgName: payload.pgName,
      customerName: payload.customerName || 'Anonymous',
      customerPhone: payload.customerPhone || '',
      reason: payload.reason || 'Other', // Wrong price, Fake photos, Full/unavailable, Wrong contact number, Other
      complaint: payload.complaint || '',
      status: 'Pending', // Pending, Resolved, Ignored, Deactivated
      actionTaken: null,
      createdAt: new Date().toISOString()
    };

    const created = await store.create('reportedListings', newReport);

    await store.create('notifications', {
      id: `notif_${Date.now()}`,
      type: 'report',
      title: 'New Listing Report',
      message: `Report filed for ${newReport.pgName}: ${newReport.reason}`,
      timestamp: new Date().toISOString(),
      read: false,
      link: '/reported'
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/reports/:id/resolve
router.patch('/:id/resolve', async (req, res) => {
  try {
    const { status, actionTaken, deactivateListing } = req.body;
    const report = await store.findById('reportedListings', req.params.id);
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' });

    const patch = {
      status: status || 'Resolved',
      actionTaken: actionTaken || 'Resolved by admin'
    };

    if (deactivateListing && report.pgId) {
      await store.update('properties', report.pgId, { status: 'Inactive' });
      patch.status = 'Deactivated';
      patch.actionTaken = `Listing deactivated and issue addressed. (${actionTaken || ''})`;
    }

    const updated = await store.update('reportedListings', req.params.id, patch);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
