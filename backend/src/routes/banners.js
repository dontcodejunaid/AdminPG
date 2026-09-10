import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/banners
router.get('/', async (req, res) => {
  try {
    const list = await store.findAll('banners');
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/banners
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const newBanner = {
      id: `ban_${uuidv4().substring(0, 8)}`,
      title: payload.title,
      subtitle: payload.subtitle || '',
      imageUrl: payload.imageUrl || '',
      targetUrl: payload.targetUrl || '/',
      placement: payload.placement || 'Homepage Hero Top',
      city: payload.city || 'All Cities',
      isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
      startDate: payload.startDate || new Date().toISOString().split('T')[0],
      endDate: payload.endDate || '2026-12-31',
      createdAt: new Date().toISOString()
    };

    const created = await store.create('banners', newBanner);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/banners/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await store.update('banners', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Banner not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/banners/:id
router.delete('/:id', async (req, res) => {
  try {
    const ok = await store.delete('banners', req.params.id);
    if (!ok) return res.status(404).json({ success: false, error: 'Banner not found' });
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
