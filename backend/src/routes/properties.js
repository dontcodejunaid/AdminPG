import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/properties
router.get('/', async (req, res) => {
  try {
    const { city, state, type, status, verificationStatus, availabilityStatus, isFeatured, search } = req.query;
    let list = await store.findAll('properties');

    if (city) list = list.filter(p => p.city?.toLowerCase() === city.toLowerCase());
    if (state) list = list.filter(p => p.state?.toLowerCase() === state.toLowerCase());
    if (type) list = list.filter(p => p.type?.toLowerCase() === type.toLowerCase());
    if (status) list = list.filter(p => p.status?.toLowerCase() === status.toLowerCase());
    if (verificationStatus) list = list.filter(p => p.verificationStatus?.toLowerCase() === verificationStatus.toLowerCase());
    if (availabilityStatus) list = list.filter(p => p.availabilityStatus?.toLowerCase() === availabilityStatus.toLowerCase());
    if (isFeatured !== undefined) list = list.filter(p => String(p.isFeatured) === String(isFeatured));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.name?.toLowerCase().includes(q) ||
        p.area?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.contactNumber?.includes(q)
      );
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/properties/:id
router.get('/:id', async (req, res) => {
  try {
    const pg = await store.findById('properties', req.params.id);
    if (!pg) return res.status(404).json({ success: false, error: 'PG Not Found' });
    res.json({ success: true, data: pg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/properties
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const newPg = {
      id: `pg_${Date.now()}`,
      name: payload.name,
      slug: (payload.name || 'pg').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
      type: payload.type || 'Boys', // Boys, Girls, Co-living
      state: payload.state || '',
      city: payload.city || '',
      area: payload.area || '',
      fullAddress: payload.fullAddress || '',
      mapUrl: payload.mapUrl || '',
      description: payload.description || '',
      contactNumber: payload.contactNumber || '',
      whatsappNumber: payload.whatsappNumber || payload.contactNumber || '',
      photos: Array.isArray(payload.photos) ? payload.photos : [],
      videoUrl: payload.videoUrl || '',
      status: payload.status || 'Active', // Active, Inactive
      availabilityStatus: payload.availabilityStatus || 'Available', // Available, Limited, Full
      verificationStatus: payload.verificationStatus || 'Pending', // Verified, Pending, Not Verified
      isFeatured: Boolean(payload.isFeatured),
      featuredOrder: Number(payload.featuredOrder) || 0,
      totalBeds: Number(payload.totalBeds) || 0,
      availableBeds: Number(payload.availableBeds) || 0,
      charges: {
        deposit: Number(payload.charges?.deposit) || 0,
        foodCharges: payload.charges?.foodCharges || 'Included',
        electricityCharges: payload.charges?.electricityCharges || 'Included',
        maintenanceCharges: Number(payload.charges?.maintenanceCharges) || 0,
        otherCharges: payload.charges?.otherCharges || 'None'
      },
      rooms: Array.isArray(payload.rooms) ? payload.rooms : [
        { id: `r_${uuidv4().substring(0, 8)}`, type: '2 Sharing', rent: 8000, deposit: 5001, totalBeds: 10, availableBeds: 2, hasAC: true, hasAttachedBath: true }
      ],
      facilities: Array.isArray(payload.facilities) ? payload.facilities : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = await store.create('properties', newPg);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/properties/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await store.update('properties', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'PG Not Found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/properties/:id/status (Quick toggle status/availability/verification/featured)
router.patch('/:id/quick-update', async (req, res) => {
  try {
    const allowedKeys = ['status', 'availabilityStatus', 'verificationStatus', 'isFeatured', 'featuredOrder', 'availableBeds'];
    const patch = {};
    for (const key of allowedKeys) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }
    const updated = await store.update('properties', req.params.id, patch);
    if (!updated) return res.status(404).json({ success: false, error: 'PG Not Found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/properties/:id
router.delete('/:id', async (req, res) => {
  try {
    const ok = await store.delete('properties', req.params.id);
    if (!ok) return res.status(404).json({ success: false, error: 'PG Not Found' });
    res.json({ success: true, message: 'PG Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
