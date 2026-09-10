import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { store } from './services/store.js';

import statsRoutes from './routes/stats.js';
import propertiesRoutes from './routes/properties.js';
import locationsRoutes from './routes/locations.js';
import facilitiesRoutes from './routes/facilities.js';
import enquiriesRoutes from './routes/enquiries.js';
import customersRoutes from './routes/customers.js';
import reportsRoutes from './routes/reports.js';
import paymentsRoutes from './routes/payments.js';
import cmsRoutes from './routes/cms.js';
import bannersRoutes from './routes/banners.js';
import notificationsRoutes from './routes/notifications.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize JSON Data Store
await store.init();

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'KeralaPG.com Admin API',
    timestamp: new Date().toISOString(),
    database: 'Decoupled Repository Store (Ready for MongoDB)'
  });
});

// Mount Routes
app.use('/api/stats', statsRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/users', usersRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 KeralaPG Admin API Server running at http://localhost:${PORT}`);
});
