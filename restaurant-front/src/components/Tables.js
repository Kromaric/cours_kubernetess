import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ capacite: '', statut: 'libre' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const data = await api.getTables();
      setTables(data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, capacite: parseInt(form.capacite) };

    try {
      if (editId) {
        await api.updateTable(editId, data);
      } else {
        await api.createTable(data);
      }
      setForm({ capacite: '', statut: 'libre' });
      setEditId(null);
      loadTables();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTable(id);
      loadTables();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (table) => {
    setEditId(table.id);
    setForm({ capacite: table.capacite.toString(), statut: table.statut });
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'libre': return 'text-green-600 bg-green-50';
      case 'occupee': return 'text-red-600 bg-red-50';
      case 'reservee': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tables</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <input
          type="number"
          placeholder="Capacité"
          value={form.capacite}
          onChange={e => setForm({ ...form, capacite: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
          required
        />
        <select
          value={form.statut}
          onChange={e => setForm({ ...form, statut: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
        >
          <option value="libre">Libre</option>
          <option value="occupee">Occupée</option>
          <option value="reservee">Réservée</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          {editId ? 'Modifier' : 'Créer'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ capacite: '', statut: 'libre' });
            }}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        )}
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tables.map(t => (
          <div key={t.id} className="bg-white p-4 rounded shadow">
            <div className="font-bold text-lg mb-1">Table #{t.id}</div>
            <div className="text-sm text-gray-600 mb-2">Capacité: {t.capacite} pers.</div>
            <div className={`text-xs font-semibold px-2 py-1 rounded inline-block mb-3 ${getStatusColor(t.statut)}`}>
              {t.statut}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleEdit(t)}
                className="flex-1 px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
              >
                Éditer
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="flex-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
