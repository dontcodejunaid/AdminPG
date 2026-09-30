import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/payments
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let list = await store.findAll('payments');

    if (status) list = list.filter(p => p.status?.toLowerCase() === status.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.transactionId?.toLowerCase().includes(q) ||
        p.customerName?.toLowerCase().includes(q) ||
        p.customerPhone?.includes(q) ||
        p.pgName?.toLowerCase().includes(q)
      );
    }

    const totalCollected = list.filter(p => p.status === 'Success').reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({
      success: true,
      count: list.length,
      totalCollected,
      data: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/payments (Simulate / Record transaction)
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const customerName = payload.customerName || payload.name || 'KeralaPG Seeker';
    const customerPhone = payload.customerPhone || payload.phone || '9900000000';
    const pgId = payload.pgId || payload.propertyId || null;
    const pgName = payload.pgName || payload.propertyName || 'KeralaPG Property';
    const amount = Number(payload.amount) || 19;

    const newTx = {
      id: `pay_${Date.now()}`,
      transactionId: `TXN_KP_${Date.now().toString().slice(-8)}`,
      customerName,
      customerPhone,
      pgId,
      pgName,
      purpose: payload.purpose || `Owner Direct Contact Unlock (₹19 Plan)`,
      amount,
      status: payload.status || 'Success',
      paymentGateway: payload.paymentGateway || 'UPI / Razorpay',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const created = await store.create('payments', newTx);

    // Sync with Customers table (Update unlockedPgs and totalPaid)
    try {
      const allCustomers = await store.findAll('customers') || [];
      const existing = allCustomers.find(c => c.phone === customerPhone || (c.name && c.name.toLowerCase() === customerName.toLowerCase()));
      if (existing) {
        const unlocked = Array.isArray(existing.unlockedPgs) ? [...existing.unlockedPgs] : [];
        if (pgId && !unlocked.includes(pgId)) {
          unlocked.push(pgId);
        }
        await store.update('customers', existing.id, {
          unlockedPgs: unlocked,
          totalPaid: (Number(existing.totalPaid) || 0) + amount
        });
      } else {
        await store.create('customers', {
          id: `cust_${Date.now()}`,
          name: customerName,
          phone: customerPhone,
          email: payload.customerEmail || payload.email || `${customerPhone}@keralapg.com`,
          city: payload.city || 'Bengaluru',
          savedPgs: [],
          unlockedPgs: pgId ? [pgId] : [],
          totalEnquiries: 1,
          totalPaid: amount,
          dateJoined: new Date().toISOString().split('T')[0]
        });
      }
    } catch (custErr) {
      console.log('Customer sync on payment unlock error:', custErr);
    }

    // Push notification to Admin
    try {
      await store.create('notifications', {
        id: `notif_${Date.now()}`,
        type: 'payment',
        title: '₹19 Direct Owner Contact Unlocked',
        message: `${customerName} paid ₹${amount} to unlock contact for ${pgName}`,
        timestamp: new Date().toISOString(),
        read: false,
        link: '/payments'
      });
    } catch (notifErr) {}

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
