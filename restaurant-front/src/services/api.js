import { API_URL } from '../config/api';

const api = {
  // Clients
  getClients: () => fetch(`${API_URL}/clients`).then(r => r.json()),
  getClient: (id) => fetch(`${API_URL}/clients/${id}`).then(r => r.json()),
  createClient: (data) => fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateClient: (id, data) => fetch(`${API_URL}/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteClient: (id) => fetch(`${API_URL}/clients/${id}`, { method: 'DELETE' }),

  // Plats
  getPlats: () => fetch(`${API_URL}/plats`).then(r => r.json()),
  getPlat: (id) => fetch(`${API_URL}/plats/${id}`).then(r => r.json()),
  createPlat: (data) => fetch(`${API_URL}/plats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updatePlat: (id, data) => fetch(`${API_URL}/plats/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deletePlat: (id) => fetch(`${API_URL}/plats/${id}`, { method: 'DELETE' }),

  // Tables
  getTables: () => fetch(`${API_URL}/tables`).then(r => r.json()),
  getTable: (id) => fetch(`${API_URL}/tables/${id}`).then(r => r.json()),
  createTable: (data) => fetch(`${API_URL}/tables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateTable: (id, data) => fetch(`${API_URL}/tables/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteTable: (id) => fetch(`${API_URL}/tables/${id}`, { method: 'DELETE' }),

  // Réservations
  getReservations: () => fetch(`${API_URL}/reservations`).then(r => r.json()),
  getReservation: (id) => fetch(`${API_URL}/reservations/${id}`).then(r => r.json()),
  createReservation: (data) => fetch(`${API_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateReservation: (id, data) => fetch(`${API_URL}/reservations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteReservation: (id) => fetch(`${API_URL}/reservations/${id}`, { method: 'DELETE' }),

  // Commandes
  getCommandes: () => fetch(`${API_URL}/commandes`).then(r => r.json()),
  getCommande: (id) => fetch(`${API_URL}/commandes/${id}`).then(r => r.json()),
  createCommande: (data) => fetch(`${API_URL}/commandes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateCommande: (id, data) => fetch(`${API_URL}/commandes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteCommande: (id) => fetch(`${API_URL}/commandes/${id}`, { method: 'DELETE' }),
};

export default api;
