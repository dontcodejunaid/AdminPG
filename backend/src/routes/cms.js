import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/cms
router.get('/', async (req, res) => {
  try {
    const cms = await store.getCMS();
    res.json({ success: true, data: cms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/cms/:section (aboutUs, contactUs, faq, termsAndConditions, privacyPolicy)
router.put('/:section', async (req, res) => {
  try {
    const updated = await store.updateCMS(req.params.section, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
