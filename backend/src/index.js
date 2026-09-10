import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Mount API Routes
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

// Serve Frontend in Production
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 KeralaPG Admin API Server running at http://localhost:${PORT}`);
});
