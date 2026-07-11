import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getVendors = () => api.get('/vendors');
export const createVendor = (data) => api.post('/vendors', data);
export const updateVendor = (id, data) => api.put(`/vendors/${id}`, data);

export const getShipments = (params = {}) => api.get('/shipments', { params });
export const createShipment = (data) => api.post('/shipments', data);
export const updateShipment = (id, data) => api.put(`/shipments/${id}`, data);

export const getInventory = () => api.get('/inventory');
export const createInventory = (data) => api.post('/inventory', data);
export const updateInventory = (id, data) => api.put(`/inventory/${id}`, data);

export const getSummary = () => api.get('/analytics/summary');
export const getShipmentTrends = () => api.get('/analytics/shipment-trends');
export const getTopVendors = () => api.get('/analytics/top-vendors');
export const updateStatus = (id, status, note) => api.patch(`/shipments/${id}/status`, { status, note });
export const addMovement = (id, data) => api.post(`/inventory/${id}/movement`, data);

export const getAlerts = (params = {}) => api.get('/alerts', { params });
export const markAlertRead = (id) => api.patch(`/alerts/${id}/read`);
export const markAllAlertsRead = () => api.patch('/alerts/read-all');