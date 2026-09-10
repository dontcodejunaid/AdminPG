import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/facilities
router.get('/', async (req, res) => {
  try {
    const list = await store.findAll('facilities');
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/facilities
router.post('/', async (req, res) => {
  try {
    const { name, icon = 'Sparkles', category = 'General' } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Facility name is required' });

    const newFacility = {
      id: `fac_${uuidv4().substring(0, 8)}`,
      name,
      icon,
      category,
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    const created = await store.create('facilities', newFacility);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/facilities/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await store.update('facilities', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Facility not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/facilities/:id
router.delete('/:id', async (req, res) => {
  try {
    const ok = await store.delete('facilities', req.params.id);
    if (!ok) return res.status(404).json({ success: false, error: 'Facility not found' });
    res.json({ success: true, message: 'Facility deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
