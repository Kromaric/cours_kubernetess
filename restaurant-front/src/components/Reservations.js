import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [clients, setClients] = useState([]);
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ clientId: '', tableId: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resaData, clientsData, tablesData] = await Promise.all([
        api.getReservations(),
        api.getClients(),
        api.getTables()
      ]);
      setReservations(resaData);
      setClients(clientsData);
      setTables(tablesData);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      clientId: parseInt(form.clientId),
      tableId: parseInt(form.tableId)
    };

    try {
      if (editId) {
        await api.updateReservation(editId, data);
      } else {
        await api.createReservation(data);
      }
      setForm({ clientId: '', tableId: '' });
      setEditId(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteReservation(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (resa) => {
    setEditId(resa.id);
    setForm({ clientId: resa.clientId.toString(), tableId: resa.tableId.toString() });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Réservations</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <select
          value={form.clientId}
          onChange={e => setForm({ ...form, clientId: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
          required
        >
          <option value="">Choisir un client</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
        <select
          value={form.tableId}
          onChange={e => setForm({ ...form, tableId: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
          required
        >
          <option value="">Choisir une table</option>
          {tables.map(t => (
            <option key={t.id} value={t.id}>
              Table #{t.id} ({t.capacite} places) - {t.statut}
            </option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          {editId ? 'Modifier' : 'Créer'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ clientId: '', tableId: '' });
            }}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        )}
      </form>

      <div className="space-y-2">
        {reservations.map(r => {
          const client = clients.find(c => c.id === r.clientId);
          const table = tables.find(t => t.id === r.tableId);
          return (
            <div key={r.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <strong className="text-lg">Réservation #{r.id}</strong>
                <div className="text-sm text-gray-600">
                  Client: {client?.nom || 'N/A'} • Table: #{table?.id || 'N/A'} ({table?.capacite} places)
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(r)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  Éditer
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
