import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialSeedData } from '../data/seedData.js';
import { supabaseStore } from './supabaseStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/store.json');

class UnifiedStore {
  constructor() {
    this.cache = null;
    this.isLoaded = false;
  }

  async init() {
    try {
      const exists = await fs.access(DATA_FILE).then(() => true).catch(() => false);
      if (!exists) {
        console.log('⚡ Initializing local store.json with rich seed data...');
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        await fs.writeFile(DATA_FILE, JSON.stringify(initialSeedData, null, 2), 'utf8');
        this.cache = JSON.parse(JSON.stringify(initialSeedData));
      } else {
        const raw = await fs.readFile(DATA_FILE, 'utf8');
        this.cache = JSON.parse(raw);
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Failed to initialize JSON store, using in-memory fallback:', err);
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

  // Generic CRUD with Supabase first -> Local fallback
  async findAll(collectionName, filterFn = null) {
    if (supabaseStore.isConfigured()) {
      const dbResult = await supabaseStore.findAll(collectionName, filterFn);
      if (dbResult !== null) return dbResult;
    }
    const list = await this.getCollection(collectionName);
    if (!Array.isArray(list)) return list;
    if (filterFn) return list.filter(filterFn);
    return list;
  }

  async findById(collectionName, id) {
    if (supabaseStore.isConfigured()) {
      const dbResult = await supabaseStore.findById(collectionName, id);
      if (dbResult !== null) return dbResult;
    }
    const list = await this.getCollection(collectionName);
    if (!Array.isArray(list)) return null;
    return list.find(item => item.id === id) || null;
  }

  async create(collectionName, item) {
    if (supabaseStore.isConfigured()) {
      try {
        const dbResult = await supabaseStore.create(collectionName, item);
        if (dbResult) return dbResult;
      } catch (err) {
        console.warn(`Supabase create failed, writing to local store:`, err.message);
      }
    }
    if (!this.isLoaded) await this.init();
    if (!this.cache[collectionName]) this.cache[collectionName] = [];
    this.cache[collectionName].unshift(item);
    await this.persist();
    return item;
  }

  async update(collectionName, id, updates) {
    if (supabaseStore.isConfigured()) {
      try {
        const dbResult = await supabaseStore.update(collectionName, id, updates);
        if (dbResult) return dbResult;
      } catch (err) {
        console.warn(`Supabase update failed, writing to local store:`, err.message);
      }
    }
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
    if (supabaseStore.isConfigured()) {
      const dbResult = await supabaseStore.delete(collectionName, id);
      if (dbResult) return true;
    }
    if (!this.isLoaded) await this.init();
    const list = this.cache[collectionName];
    if (!Array.isArray(list)) return false;
    const initialLen = list.length;
    this.cache[collectionName] = list.filter(item => item.id !== id);
    const deleted = this.cache[collectionName].length < initialLen;
    if (deleted) await this.persist();
    return deleted;
  }

  // Locations Hierarchical
  async getLocations() {
    if (supabaseStore.isConfigured()) {
      const dbLocations = await supabaseStore.getLocations();
      if (dbLocations && dbLocations.length > 0) return dbLocations;
    }
    return this.getCollection('locations');
  }

  // CMS specific get/update
  async getCMS() {
    if (supabaseStore.isConfigured()) {
      const dbCms = await supabaseStore.getCMS();
      if (dbCms && Object.keys(dbCms).length > 0) return dbCms;
    }
    if (!this.isLoaded) await this.init();
    return this.cache.cmsPages || {};
  }

  async updateCMS(section, data) {
    if (supabaseStore.isConfigured()) {
      try {
        const dbUpdated = await supabaseStore.updateCMS(section, data);
        if (dbUpdated) return dbUpdated;
      } catch (err) {
        console.warn(`Supabase CMS update failed, writing to local store:`, err.message);
      }
    }
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
    const pgs = await this.findAll('properties');
    const enquiries = await this.findAll('enquiries');
    const locations = await this.getLocations();
    const reports = await this.findAll('reports');
    const payments = await this.findAll('payments');
    const customers = await this.findAll('customers');

    const totalPgs = pgs.length;
    const activePgs = pgs.filter(p => p.status === 'Active').length;
    const pendingPgs = pgs.filter(p => p.verificationStatus === 'Pending').length;
    const verifiedPgs = pgs.filter(p => p.verificationStatus === 'Verified').length;
    const fullPgs = pgs.filter(p => p.availabilityStatus === 'Full').length;
    const availablePgs = pgs.filter(p => p.availabilityStatus === 'Available').length;
    const limitedPgs = pgs.filter(p => p.availabilityStatus === 'Limited').length;
    const featuredPgs = pgs.filter(p => p.isFeatured).length;

    let totalCities = 0;
    (locations || []).forEach(country => {
      (country.states || []).forEach(state => {
        totalCities += (state.cities || []).length;
      });
    });

    const totalEnquiries = enquiries.length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayEnquiries = enquiries.filter(e => e.createdAt && e.createdAt.startsWith(todayStr)).length;
    const pendingReports = reports.filter(r => r.status === 'Pending').length;
    const totalRevenue = payments.filter(p => p.status === 'Success').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

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

export const store = new UnifiedStore();
