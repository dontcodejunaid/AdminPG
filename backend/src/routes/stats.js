import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/stats/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await store.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
