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

// Whitelist of valid PostgreSQL columns per table to prevent PostgREST column missing errors
const VALID_COLUMNS = {
  profiles: new Set([
    'id', 'auth_user_id', 'email', 'password_hash', 'name', 'phone', 'role',
    'avatar_url', 'status', 'permissions', 'last_login', 'created_at', 'updated_at'
  ]),
  properties: new Set([
    'id', 'name', 'slug', 'type', 'status', 'availability_status', 'verification_status',
    'is_featured', 'featured_order', 'state', 'city', 'area', 'full_address', 'landmark',
    'pincode', 'map_url', 'latitude', 'longitude', 'description', 'notice_period',
    'gate_closing_time', 'food_availability', 'rules', 'rooms', 'facilities', 'photos',
    'videos', 'owner_name', 'owner_phone', 'whatsapp_number', 'owner_email', 'view_count',
    'inquiry_count', 'unlock_count', 'created_by', 'created_at', 'updated_at'
  ]),
  locations_states: new Set([
    'id', 'name', 'code', 'country', 'is_active', 'created_at'
  ]),
  locations_cities: new Set([
    'id', 'state_id', 'state_name', 'name', 'code', 'display_order', 'is_active', 'created_at'
  ]),
  locations_areas: new Set([
    'id', 'city_id', 'city_name', 'name', 'pincode', 'is_popular', 'created_at'
  ]),
  facilities: new Set([
    'id', 'name', 'icon', 'category', 'is_default', 'is_active', 'created_at'
  ]),
  customers: new Set([
    'id', 'auth_user_id', 'name', 'phone', 'email', 'city', 'saved_pgs', 'unlocked_pgs',
    'total_enquiries', 'total_paid', 'date_joined', 'created_at', 'updated_at'
  ]),
  enquiries: new Set([
    'id', 'pg_id', 'pg_name', 'customer_name', 'customer_phone', 'customer_email',
    'room_type', 'message', 'status', 'scheduled_date', 'assigned_to', 'internal_notes',
    'created_at', 'updated_at'
  ]),
  reports: new Set([
    'id', 'pg_id', 'pg_name', 'customer_name', 'customer_phone', 'reason', 'complaint',
    'status', 'action_taken', 'resolved_by', 'resolved_at', 'created_at', 'updated_at'
  ]),
  payments: new Set([
    'id', 'transaction_id', 'customer_id', 'customer_name', 'customer_phone', 'pg_id',
    'pg_name', 'purpose', 'amount', 'status', 'payment_gateway', 'raw_gateway_response',
    'created_at'
  ]),
  banners: new Set([
    'id', 'title', 'subtitle', 'image_url', 'target_url', 'placement', 'city',
    'is_active', 'start_date', 'end_date', 'clicks_count', 'created_at', 'updated_at'
  ]),
  notifications: new Set([
    'id', 'type', 'title', 'message', 'link', 'read', 'metadata', 'created_at'
  ]),
  cms_content: new Set([
    'key', 'title', 'content', 'updated_at'
  ])
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
    if (!converted.slug) converted.slug = (converted.name || 'pg').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    if (converted.type === 'Co-living' || converted.type === 'co-living') converted.type = 'Coliving';
    if (!['Boys', 'Girls', 'Coliving', 'Unisex'].includes(converted.type)) converted.type = 'Boys';
    if (converted.verification_status === 'Not Verified' || converted.verification_status === 'not verified') {
      converted.verification_status = 'Pending';
    }
    if (!['Verified', 'Pending', 'Rejected'].includes(converted.verification_status)) {
      converted.verification_status = 'Pending';
    }
    if (!['Active', 'Inactive', 'Draft'].includes(converted.status)) {
      converted.status = 'Active';
    }
    if (!['Available', 'Limited', 'Full'].includes(converted.availability_status)) {
      converted.availability_status = 'Available';
    }
    if (converted.charges && typeof converted.charges === 'object') {
      if (converted.charges.foodCharges && !converted.food_availability) {
        converted.food_availability = converted.charges.foodCharges;
      }
    }
    if (converted.video_url || converted.videoUrl) {
      const vUrl = converted.video_url || converted.videoUrl;
      if (!converted.videos || !Array.isArray(converted.videos) || converted.videos.length === 0) {
        converted.videos = vUrl ? [vUrl] : [];
      }
    }
    if (!Array.isArray(converted.videos)) converted.videos = [];
    if (!Array.isArray(converted.photos)) converted.photos = [];
    if (!Array.isArray(converted.rooms)) converted.rooms = [];
    if (!Array.isArray(converted.facilities)) converted.facilities = [];
    if (!Array.isArray(converted.rules)) converted.rules = [];
    if (converted.is_featured === undefined) converted.is_featured = false;
    if (converted.featured_order === undefined) converted.featured_order = 0;
  }

  if (table === 'enquiries') {
    if (converted.admin_notes && !converted.internal_notes) {
      converted.internal_notes = converted.admin_notes;
    }
    const statusMap = {
      'New': 'New',
      'new': 'New',
      'Contacted': 'Contacted',
      'contacted': 'Contacted',
      'Interested': 'Contacted',
      'interested': 'Contacted',
      'Visited': 'Scheduled Visit',
      'visited': 'Scheduled Visit',
      'Scheduled Visit': 'Scheduled Visit',
      'scheduled visit': 'Scheduled Visit',
      'Converted': 'Converted',
      'converted': 'Converted',
      'Closed': 'Converted',
      'closed': 'Converted',
      'Lost': 'Lost',
      'lost': 'Lost'
    };
    if (converted.status) {
      converted.status = statusMap[converted.status] || 'New';
    }
  }

  // Filter keys strictly to known columns for the table if column schema is defined
  const validCols = VALID_COLUMNS[table];
  if (validCols) {
    const cleaned = {};
    for (const [k, v] of Object.entries(converted)) {
      if (validCols.has(k)) {
        cleaned[k] = v;
      }
    }
    return cleaned;
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
    converted.whatsappNumber = converted.whatsappNumber || converted.ownerPhone || '';
    converted.fullAddress = converted.fullAddress || '';
    converted.videoUrl = (Array.isArray(converted.videos) && converted.videos[0]) || '';
    converted.charges = converted.charges || {
      deposit: (Array.isArray(converted.rooms) && converted.rooms[0]?.deposit) || 5000,
      foodCharges: converted.foodAvailability || 'Included in Rent',
      electricityCharges: 'Included',
      maintenanceCharges: 0,
      otherCharges: 'None'
    };
    if (Array.isArray(converted.rooms) && converted.rooms.length > 0) {
      const rents = converted.rooms.map(r => Number(r.rent || r.price || 0)).filter(r => r > 0);
      converted.minRent = rents.length > 0 ? Math.min(...rents) : 0;
      converted.totalBeds = converted.rooms.reduce((acc, r) => acc + (Number(r.totalBeds || r.total_beds) || 0), 0);
      converted.availableBeds = converted.rooms.reduce((acc, r) => acc + (Number(r.availableBeds || r.available_beds) || 0), 0);
    }
  }

  if (table === 'enquiries') {
    converted.adminNotes = converted.internalNotes || converted.adminNotes || '';
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
