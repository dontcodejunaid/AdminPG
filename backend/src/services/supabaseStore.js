import { supabase, isSupabaseConfigured } from './supabase.js';

// Table Mapping from Store Collection to Supabase Table Name
const COLLECTION_TABLE_MAP = {
  properties: 'properties',
  adminUsers: 'profiles',
  facilities: 'facilities',
  enquiries: 'enquiries',
  customers: 'customers',
  reportedListings: 'reports',
  reports: 'reports',
  payments: 'payments',
  banners: 'banners',
  notifications: 'notifications'
};

// Convert camelCase object to snake_case for PostgreSQL
function toDbFormat(data, table = '') {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(d => toDbFormat(d, table));
  const converted = {};
  for (const [key, value] of Object.entries(data)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    converted[snakeKey] = value;
  }

  // Schema-specific fixes
  if (table === 'profiles') {
    if (converted.password && !converted.password_hash) {
      converted.password_hash = converted.password;
    }
    delete converted.password; // profiles table column is password_hash
  }

  if (table === 'properties') {
    if (converted.contact_number && !converted.owner_phone) {
      converted.owner_phone = converted.contact_number;
    }
    if (!converted.owner_phone) converted.owner_phone = '+91 98470 00000';
    if (!converted.owner_name) converted.owner_name = converted.name || 'PG Caretaker';
    if (!converted.full_address) converted.full_address = `${converted.area || 'Kakkanad'}, ${converted.city || 'Kochi'}`;
    if (!converted.state) converted.state = 'Kerala';
    if (!converted.city) converted.city = 'Kochi';
    if (!converted.area) converted.area = 'Kakkanad';
    if (converted.type === 'Co-living' || converted.type === 'co-living') converted.type = 'Coliving';
    if (converted.verification_status === 'Not Verified' || converted.verification_status === 'not verified') {
      converted.verification_status = 'Pending';
    }
    delete converted.contact_number;
    delete converted.charges;
    delete converted.total_beds;
    delete converted.available_beds;
    delete converted.min_rent;
  }

  return converted;
}

// Convert snake_case object to camelCase for frontend consistency
function fromDbFormat(data, table = '') {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(d => fromDbFormat(d, table));
  const converted = {};
  for (const [key, value] of Object.entries(data)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    converted[camelKey] = value;
  }

  if (table === 'profiles' || converted.passwordHash || converted.password_hash) {
    const pass = converted.passwordHash || converted.password_hash || '';
    converted.password = pass;
    converted.passwordHash = pass;
  }

  if (table === 'properties') {
    converted.contactNumber = converted.ownerPhone || converted.whatsappNumber || '';
    converted.fullAddress = converted.fullAddress || '';
    if (Array.isArray(converted.rooms) && converted.rooms.length > 0) {
      const rents = converted.rooms.map(r => Number(r.rent || r.price || 0)).filter(r => r > 0);
      converted.minRent = rents.length > 0 ? Math.min(...rents) : 0;
      converted.totalBeds = converted.rooms.reduce((acc, r) => acc + (Number(r.totalBeds || r.total_beds) || 0), 0);
      converted.availableBeds = converted.rooms.reduce((acc, r) => acc + (Number(r.availableBeds || r.available_beds) || 0), 0);
    }
  }

  return converted;
}

export const supabaseStore = {
  isConfigured() {
    return isSupabaseConfigured() && supabase !== null;
  },

  async findAll(collectionName, filterFn = null) {
    if (!this.isConfigured()) return null;
    const table = COLLECTION_TABLE_MAP[collectionName];
    if (!table) return null;

    let query = supabase.from(table).select('*');
    if (table === 'properties') {
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
    } else if (table === 'notifications' || table === 'enquiries' || table === 'reports' || table === 'payments') {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
      console.error(`Supabase findAll error on table [${table}]:`, error.message);
      return null;
    }

    const items = (data || []).map(d => fromDbFormat(d, table));
    if (filterFn) return items.filter(filterFn);
    return items;
  },

  async findById(collectionName, id) {
    if (!this.isConfigured()) return null;
    const table = COLLECTION_TABLE_MAP[collectionName];
    if (!table) return null;

    const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
    if (error) {
      console.error(`Supabase findById error on table [${table}] id [${id}]:`, error.message);
      return null;
    }
    return data ? fromDbFormat(data, table) : null;
  },

  async create(collectionName, item) {
    if (!this.isConfigured()) return null;
    const table = COLLECTION_TABLE_MAP[collectionName];
    if (!table) return null;

    const dbPayload = toDbFormat(item, table);
    const { data, error } = await supabase.from(table).insert([dbPayload]).select().single();
    if (error) {
      console.error(`Supabase create error on table [${table}]:`, error.message);
      throw error;
    }
    return fromDbFormat(data, table);
  },

  async update(collectionName, id, updates) {
    if (!this.isConfigured()) return null;
    const table = COLLECTION_TABLE_MAP[collectionName];
    if (!table) return null;

    const dbPayload = toDbFormat(updates, table);
    delete dbPayload.id; // never overwrite primary key
    dbPayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from(table).update(dbPayload).eq('id', id).select().single();
    if (error) {
      console.error(`Supabase update error on table [${table}] id [${id}]:`, error.message);
      throw error;
    }
    return fromDbFormat(data, table);
  },

  async delete(collectionName, id) {
    if (!this.isConfigured()) return null;
    const table = COLLECTION_TABLE_MAP[collectionName];
    if (!table) return null;

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.error(`Supabase delete error on table [${table}] id [${id}]:`, error.message);
      return false;
    }
    return true;
  },

  // Hierarchical Locations Adapter
  async getLocations() {
    if (!this.isConfigured()) return null;
    try {
      const [statesRes, citiesRes, areasRes] = await Promise.all([
        supabase.from('locations_states').select('*'),
        supabase.from('locations_cities').select('*').order('display_order', { ascending: true }),
        supabase.from('locations_areas').select('*')
      ]);

      if (statesRes.error || citiesRes.error || areasRes.error) return null;

      const states = statesRes.data || [];
      const cities = citiesRes.data || [];
      const areas = areasRes.data || [];

      if (states.length === 0) return null;

      return [
        {
          id: 'loc_in',
          name: 'India',
          code: 'IN',
          type: 'country',
          states: states.map(state => ({
            id: state.id,
            name: state.name,
            code: state.code,
            type: 'state',
            cities: cities.filter(c => c.state_id === state.id || c.state_name === state.name).map(city => ({
              id: city.id,
              name: city.name,
              code: city.code,
              areas: areas.filter(a => a.city_id === city.id || a.city_name === city.name).map(a => a.name)
            }))
          }))
        }
      ];
    } catch (err) {
      console.error('Supabase getLocations error:', err.message);
      return null;
    }
  },

  // CMS Content Adapter
  async getCMS() {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('cms_content').select('*');
      if (error || !data || data.length === 0) return null;
      const cmsMap = {};
      data.forEach(item => {
        cmsMap[item.key] = item.content;
      });
      return cmsMap;
    } catch (err) {
      console.error('Supabase getCMS error:', err.message);
      return null;
    }
  },

  async updateCMS(section, data) {
    if (!this.isConfigured()) return null;
    try {
      const { data: updated, error } = await supabase.from('cms_content').upsert({
        key: section,
        content: data,
        updated_at: new Date().toISOString()
      }).select().single();
      if (error) throw error;
      return updated.content;
    } catch (err) {
      console.error(`Supabase updateCMS error for [${section}]:`, err.message);
      throw err;
    }
  }
};
