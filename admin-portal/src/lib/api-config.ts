// API Configuration
// This file centralizes all API endpoint configurations

export const API_CONFIG = {
  // Base API URL - automatically detects environment
  get BASE_URL() {
    if (typeof window === 'undefined') return 'https://engracedsmile.com';
    
    // Check if we're on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'https://engracedsmile.com';
    }
    
    // Production: use the main domain's API
    return 'https://engracedsmile.com';
  },
  
  // API Version
  API_VERSION: 'v1',
  
  // Full API path
  get API_BASE() {
    return `${this.BASE_URL}/api/${this.API_VERSION}`;
  },
  
  // Helper function to get headers with auth token
  getAuthHeaders: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  },
  
  // Helper function to make authenticated fetch requests
  fetch: async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.API_BASE}${endpoint}`;
    const headers = {
      ...API_CONFIG.getAuthHeaders(),
      ...options.headers,
    };
    
    return fetch(url, {
      ...options,
      headers,
    });
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    ADMIN_LOGIN: '/simple-admin/login',
    REFRESH: '/auth/refresh',
  },
  
  // Admins
  ADMINS: {
    LIST: '/admins',
    STATS: '/admins/stats',
    CREATE: '/admins',
    UPDATE: (id: string) => `/admins/${id}`,
    DELETE: (id: string) => `/admins/${id}`,
    CHANGE_PASSWORD: (id: string) => `/admins/${id}/password`,
  },
  
  // Bookings
  BOOKINGS: {
    LIST: '/bookings',
    GET: (id: string) => `/bookings/${id}`,
    CREATE: '/bookings',
    UPDATE: (id: string) => `/bookings/${id}`,
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
  },
  
  // Routes
  ROUTES: {
    LIST: '/routes',
    GET: (id: string) => `/routes/${id}`,
    CREATE: '/routes',
    UPDATE: (id: string) => `/routes/${id}`,
    DELETE: (id: string) => `/routes/${id}`,
  },
  
  // Trips
  TRIPS: {
    LIST: '/trips',
    GET: (id: string) => `/trips/${id}`,
    CREATE: '/trips',
    UPDATE: (id: string) => `/trips/${id}`,
    DELETE: (id: string) => `/trips/${id}`,
  },
  
  // Drivers
  DRIVERS: {
    LIST: '/drivers',
    GET: (id: string) => `/drivers/${id}`,
    CREATE: '/drivers',
    UPDATE: (id: string) => `/drivers/${id}`,
    DELETE: (id: string) => `/drivers/${id}`,
    STATS: (id: string) => `/drivers/${id}/stats`,
  },
  
  // Vehicles
  VEHICLES: {
    LIST: '/vehicles',
    GET: (id: string) => `/vehicles/${id}`,
    CREATE: '/vehicles',
    UPDATE: (id: string) => `/vehicles/${id}`,
    DELETE: (id: string) => `/vehicles/${id}`,
    STATS: (id: string) => `/vehicles/${id}/stats`,
  },
  
  // Payments
  PAYMENTS: {
    LIST: '/payments',
    GET: (id: string) => `/payments/${id}`,
    STATS: '/payments/stats',
  },
  
  // Promotions
  PROMOTIONS: {
    LIST: '/promotions',
    GET: (id: string) => `/promotions/${id}`,
    CREATE: '/promotions',
    UPDATE: (id: string) => `/promotions/${id}`,
    DELETE: (id: string) => `/promotions/${id}`,
  },
  
  // System
  SYSTEM: {
    STATS: '/system/stats',
    SETTINGS: '/system/settings',
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE: (id: string) => `/notifications/${id}`,
  },
};

