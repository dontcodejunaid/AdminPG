const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: text || `Server returned error (${res.status})` };
    }

    if (!res.ok) {
      throw new Error(data.error || `HTTP error! status: ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Stats
  getDashboardStats: () => request('/stats/dashboard'),

  // Properties & Rooms
  getProperties: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/properties${qs ? `?${qs}` : ''}`);
  },
  getProperty: (id) => request(`/properties/${id}`),
  createProperty: (data) => request('/properties', { method: 'POST', body: data }),
  updateProperty: (id, data) => request(`/properties/${id}`, { method: 'PUT', body: data }),
  quickUpdateProperty: (id, data) => request(`/properties/${id}/quick-update`, { method: 'PATCH', body: data }),
  deleteProperty: (id) => request(`/properties/${id}`, { method: 'DELETE' }),

  // Locations (Dynamic Country/State/City/Area)
  getLocations: () => request('/locations'),
  getFlatLocations: () => request('/locations/flat'),
  addState: (data) => request('/locations/state', { method: 'POST', body: data }),
  addCity: (data) => request('/locations/city', { method: 'POST', body: data }),
  addArea: (data) => request('/locations/area', { method: 'POST', body: data }),
  deleteCity: (cityId) => request(`/locations/city/${cityId}`, { method: 'DELETE' }),
  deleteArea: (cityName, areaName) => request('/locations/area', { method: 'DELETE', body: { cityName, areaName } }),

  // Facilities
  getFacilities: () => request('/facilities'),
  createFacility: (data) => request('/facilities', { method: 'POST', body: data }),
  updateFacility: (id, data) => request(`/facilities/${id}`, { method: 'PUT', body: data }),
  deleteFacility: (id) => request(`/facilities/${id}`, { method: 'DELETE' }),

  // Enquiries & CRM Leads
  getEnquiries: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/enquiries${qs ? `?${qs}` : ''}`);
  },
  createEnquiry: (data) => request('/enquiries', { method: 'POST', body: data }),
  updateEnquiryStatus: (id, data) => request(`/enquiries/${id}/status`, { method: 'PATCH', body: data }),
  deleteEnquiry: (id) => request(`/enquiries/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/customers${qs ? `?${qs}` : ''}`);
  },
  createCustomer: (data) => request('/customers', { method: 'POST', body: data }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  // Reported Listings Moderation
  getReports: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/reports${qs ? `?${qs}` : ''}`);
  },
  resolveReport: (id, data) => request(`/reports/${id}/resolve`, { method: 'PATCH', body: data }),

  // Payments
  getPayments: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/payments${qs ? `?${qs}` : ''}`);
  },
  createPayment: (data) => request('/payments', { method: 'POST', body: data }),

  // CMS Content
  getCms: () => request('/cms'),
  updateCms: (section, data) => request(`/cms/${section}`, { method: 'PUT', body: data }),

  // Banners & Ads
  getBanners: () => request('/banners'),
  createBanner: (data) => request('/banners', { method: 'POST', body: data }),
  updateBanner: (id, data) => request(`/banners/${id}`, { method: 'PUT', body: data }),
  deleteBanner: (id) => request(`/banners/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/mark-all-read', { method: 'POST' }),

  // Admin Users & RBAC & Auth
  login: (credentials) => request('/users/login', { method: 'POST', body: credentials }),
  register: (userData) => request('/users/register', { method: 'POST', body: userData }),
  getUsers: () => request('/users'),
  createUser: (data) => request('/users', { method: 'POST', body: data }),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: data }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' })
};
