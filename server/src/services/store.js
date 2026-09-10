import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialSeedData } from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/store.json');

class JsonStore {
  constructor() {
    this.cache = null;
    this.isLoaded = false;
  }

  async init() {
    try {
      const exists = await fs.access(DATA_FILE).then(() => true).catch(() => false);
      if (!exists) {
        console.log('⚡ Initializing store.json with rich seed data...');
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        await fs.writeFile(DATA_FILE, JSON.stringify(initialSeedData, null, 2), 'utf8');
        this.cache = JSON.parse(JSON.stringify(initialSeedData));
      } else {
        const raw = await fs.readFile(DATA_FILE, 'utf8');
        this.cache = JSON.parse(raw);
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Failed to initialize JSON store, falling back to in-memory seeds:', err);
      this.cache = JSON.parse(JSON.stringify(initialSeedData));
      this.isLoaded = true;
    }
  }

  async persist() {
    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(this.cache, null, 2), 'utf8');
    } catch (err) {
      console.error('Error persisting store.json:', err);
    }
  }

  async getCollection(name) {
    if (!this.isLoaded) await this.init();
    return this.cache[name] || [];
  }

  async setCollection(name, data) {
    if (!this.isLoaded) await this.init();
    this.cache[name] = data;
    await this.persist();
    return this.cache[name];
  }

  // Generic CRUD
  async findAll(collectionName, filterFn = null) {
    const list = await this.getCollection(collectionName);
    if (!Array.isArray(list)) return list;
    if (filterFn) return list.filter(filterFn);
    return list;
  }

  async findById(collectionName, id) {
    const list = await this.getCollection(collectionName);
    if (!Array.isArray(list)) return null;
    return list.find(item => item.id === id) || null;
  }

  async create(collectionName, item) {
    if (!this.isLoaded) await this.init();
    if (!this.cache[collectionName]) this.cache[collectionName] = [];
    this.cache[collectionName].unshift(item);
    await this.persist();
    return item;
  }

  async update(collectionName, id, updates) {
    if (!this.isLoaded) await this.init();
    const list = this.cache[collectionName];
    if (!Array.isArray(list)) return null;
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    await this.persist();
    return list[index];
  }

  async delete(collectionName, id) {
    if (!this.isLoaded) await this.init();
    const list = this.cache[collectionName];
    if (!Array.isArray(list)) return false;
    const initialLen = list.length;
    this.cache[collectionName] = list.filter(item => item.id !== id);
    const deleted = this.cache[collectionName].length < initialLen;
    if (deleted) await this.persist();
    return deleted;
  }

  // CMS specific get/update
  async getCMS() {
    if (!this.isLoaded) await this.init();
    return this.cache.cmsPages || {};
  }

  async updateCMS(section, data) {
    if (!this.isLoaded) await this.init();
    this.cache.cmsPages = {
      ...this.cache.cmsPages,
      [section]: {
        ...this.cache.cmsPages[section],
        ...data,
        updatedAt: new Date().toISOString()
      }
    };
    await this.persist();
    return this.cache.cmsPages[section];
  }

  // Dashboard Aggregations
  async getDashboardStats() {
    if (!this.isLoaded) await this.init();
    const pgs = this.cache.properties || [];
    const enquiries = this.cache.enquiries || [];
    const locations = this.cache.locations || [];
    const reports = this.cache.reportedListings || [];
    const payments = this.cache.payments || [];
    const customers = this.cache.customers || [];

    const totalPgs = pgs.length;
    const activePgs = pgs.filter(p => p.status === 'Active').length;
    const pendingPgs = pgs.filter(p => p.verificationStatus === 'Pending').length;
    const verifiedPgs = pgs.filter(p => p.verificationStatus === 'Verified').length;
    const fullPgs = pgs.filter(p => p.availabilityStatus === 'Full').length;
    const availablePgs = pgs.filter(p => p.availabilityStatus === 'Available').length;
    const limitedPgs = pgs.filter(p => p.availabilityStatus === 'Limited').length;
    const featuredPgs = pgs.filter(p => p.isFeatured).length;

    // Count all distinct cities across countries & states
    let totalCities = 0;
    locations.forEach(country => {
      (country.states || []).forEach(state => {
        totalCities += (state.cities || []).length;
      });
    });

    const totalEnquiries = enquiries.length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayEnquiries = enquiries.filter(e => e.createdAt && e.createdAt.startsWith(todayStr)).length;
    const pendingReports = reports.filter(r => r.status === 'Pending').length;
    const totalRevenue = payments.filter(p => p.status === 'Success').reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return {
      totalPgs,
      activePgs,
      pendingPgs,
      verifiedPgs,
      fullPgs,
      availablePgs,
      limitedPgs,
      featuredPgs,
      totalCities,
      totalEnquiries,
      todayEnquiries,
      totalCustomers: customers.length,
      pendingReports,
      totalRevenue,
      recentPgs: pgs.slice(0, 5),
      recentEnquiries: enquiries.slice(0, 5)
    };
  }
}

export const store = new JsonStore();
