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
      id: payload.id || `pg_${Date.now()}`,
      name: payload.name,
      slug: payload.slug || ((payload.name || 'pg').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()),
      type: payload.type || 'Boys', // Boys, Girls, Co-living
      state: payload.state || '',
      city: payload.city || '',
      area: payload.area || '',
      fullAddress: payload.fullAddress || '',
      direction: payload.direction || payload.landmark || '',
      landmark: payload.landmark || payload.direction || '',
      mapUrl: payload.mapUrl || '',
      description: payload.description || '',
      badge: payload.badge || '',
      rating: Number(payload.rating) || 4.9,
      reviewsCount: Number(payload.reviewsCount) || 140,
      contactNumber: payload.contactNumber || '',
      whatsappNumber: payload.whatsappNumber || payload.contactNumber || '',
      alternatePhone: payload.alternatePhone || '',
      photos: Array.isArray(payload.photos) ? payload.photos : [],
      videoUrl: payload.videoUrl || '',
      virtualTourUrl: payload.virtualTourUrl || '',
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
        otherCharges: payload.charges?.otherCharges || 'None',
        dayRate: Number(payload.charges?.dayRate) || Number(payload.stayRates?.day) || 499,
        weekRate: Number(payload.charges?.weekRate) || Number(payload.stayRates?.week) || 2199,
        monthRate: Number(payload.charges?.monthRate) || Number(payload.stayRates?.month) || 7499,
        dayBenefit: payload.charges?.dayBenefit || payload.stayBenefits?.day || 'Free hot Kerala breakfast • Zero deposit',
        weekBenefit: payload.charges?.weekBenefit || payload.stayBenefits?.week || 'Homestyle breakfast & dinner • Flexible lease',
        monthBenefit: payload.charges?.monthBenefit || payload.stayBenefits?.month || '3x Kerala meals daily + evening chai • Full access',
      },
      stayRates: {
        day: Number(payload.stayRates?.day) || Number(payload.charges?.dayRate) || 499,
        week: Number(payload.stayRates?.week) || Number(payload.charges?.weekRate) || 2199,
        month: Number(payload.stayRates?.month) || Number(payload.charges?.monthRate) || 7499,
      },
      stayBenefits: {
        day: payload.stayBenefits?.day || payload.charges?.dayBenefit || 'Free hot Kerala breakfast • Zero deposit',
        week: payload.stayBenefits?.week || payload.charges?.weekBenefit || 'Homestyle breakfast & dinner • Flexible lease',
        month: payload.stayBenefits?.month || payload.charges?.monthBenefit || '3x Kerala meals daily + evening chai • Full access',
      },
      rooms: Array.isArray(payload.rooms) ? payload.rooms : [
        { id: `r_${uuidv4().substring(0, 8)}`, type: '2 Sharing', rent: 8000, deposit: 5001, totalBeds: 10, availableBeds: 2, hasAC: true, hasAttachedBath: true }
      ],
      facilities: Array.isArray(payload.facilities) ? payload.facilities : [],
      highlights: Array.isArray(payload.highlights) ? payload.highlights : [],
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
