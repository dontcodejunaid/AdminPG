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
    const newTx = {
      id: `pay_${Date.now()}`,
      transactionId: `TXN_KP_${Date.now().toString().slice(-8)}`,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      pgName: payload.pgName || 'KeralaPG Service',
      purpose: payload.purpose || 'Owner Direct Contact Unlock (₹19 Plan)',
      amount: Number(payload.amount) || 19,
      status: payload.status || 'Success',
      paymentGateway: payload.paymentGateway || 'UPI / Razorpay',
      date: new Date().toISOString()
    };

    const created = await store.create('payments', newTx);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
