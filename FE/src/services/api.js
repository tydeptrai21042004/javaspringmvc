import axios from 'axios';

// Proxy will forward "/api" to http://localhost:8080
const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export default API;

// ─── feedback ────────────────────────────────────────────────────────────────
export function getFeedback(productId) {
  return API.get(`/products/${productId}/feedback`);
}
export function postFeedback(productId, feedback) {
  return API.post(`/products/${productId}/feedback`, feedback);
}

// ─── categories ───────────────────────────────────────────────────────────────
export function getCategories()   { return API.get('/admin/categories'); }
export function addCategory(c)    { return API.post('/admin/categories', c); }
export function deleteCategory(i) { return API.delete(`/admin/categories/${i}`); }

// ─── brands ───────────────────────────────────────────────────────────────────
export function getBrands()    { return API.get('/admin/brands'); }
export function addBrand(b)    { return API.post('/admin/brands', b); }
export function deleteBrand(i) { return API.delete(`/admin/brands/${i}`); }

// ─── admin dashboard ──────────────────────────────────────────────────────────
export function getAdminStats()  { return API.get('/admin/stats'); }
export function getAdminUsers()  { return API.get('/admin/users'); }
export function banAdminUser(id) { return API.post(`/admin/users/${id}/ban`); }

// ─── user chat ────────────────────────────────────────────────────────────────
// user sends a message to admin
export function sendChatMessage(content) {
  return API.post('/chat/user/send', { content });
}
// user fetches their thread with the admin
export function getChatHistory() {
  return API.get('/chat/user/with-admin');
}

// ─── admin chat ───────────────────────────────────────────────────────────────
// admin lists all users who have chatted
export function listChatUsers() {
  return API.get('/chat/admin/users');
}
// admin fetches one user’s thread
export function getChatForUser(userId) {
  return API.get(`/chat/admin/${userId}`);
}
// admin replies to that user
export function adminReply(userId, content) {
  return API.post(`/chat/admin/${userId}`, { content });
}

// ─── route listing (optional) ─────────────────────────────────────────────────
export function getAdminRoutes() {
  return API.get('/admin/routes');
}