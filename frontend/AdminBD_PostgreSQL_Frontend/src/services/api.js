import axios from "axios";

// EN DEV  : http://localhost:8000
// EN PROD : /api (proxy Nginx vers le backend)
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

axios.defaults.baseURL = BASE_URL;

// Récupérer l'utilisateur connecté
const getUser = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u).username : "inconnu";
};

// Headers avec l'utilisateur connecté
const authHeaders = () => ({
  headers: { "X-Username": getUser() },
});

export const clientsAPI = {
  getAll: () => axios.get(`/clients.php`),
  create: (data) => axios.post(`/clients.php`, data, authHeaders()),
  delete: (id) => axios.delete(`/clients.php?id=${id}`, authHeaders()),
};

export const versementsAPI = {
  getAll: () => axios.get(`/versements.php`),
  create: (data) => axios.post(`/versements.php`, data, authHeaders()),
  update: (data) => axios.put(`/versements.php`, data, authHeaders()),
  delete: (id) => axios.delete(`/versements.php?id=${id}`, authHeaders()),
};

export const auditAPI = {
  getAll: () => axios.get(`/audit.php`),
};
