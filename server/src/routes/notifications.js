import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const list = await store.findAll('notifications');
    const unreadCount = list.filter(n => !n.read).length;
    res.json({ success: true, count: list.length, unreadCount, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    const updated = await store.update('notifications', req.params.id, { read: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', async (req, res) => {
  try {
    const list = await store.findAll('notifications');
    const updated = list.map(n => ({ ...n, read: true }));
    await store.setCollection('notifications', updated);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
