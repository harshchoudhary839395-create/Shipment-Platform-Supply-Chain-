import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getVendors    = () => api.get('/vendors');
export const getShipments  = () => api.get('/shipments');
export const getInventory  = () => api.get('/inventory');
export const getSummary    = () => api.get('/analytics/summary');
export const updateStatus  = (id, status) => api.patch(`/shipments/${id}`, { status });
export const addMovement   = (id, data)   => api.post(`/inventory/${id}/movement`, data);