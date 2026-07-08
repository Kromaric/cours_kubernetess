import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ nom: '', allergies: '', majeur: true, vegetarien: false });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      allergies: form.allergies.split(',').map(a => a.trim()).filter(Boolean)
    };

    try {
      if (editId) {
        await api.updateClient(editId, data);
      } else {
        await api.createClient(data);
      }
      setForm({ nom: '', allergies: '', majeur: true, vegetarien: false });
      setEditId(null);
      loadClients();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteClient(id);
      loadClients();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (client) => {
    setEditId(client.id);
    setForm({
      nom: client.nom,
      allergies: client.allergies.join(', '),
      majeur: client.majeur,
      vegetarien: client.vegetarien
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Clients</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <input
          placeholder="Nom"
          value={form.nom}
          onChange={e => setForm({ ...form, nom: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
          required
        />
        <input
          placeholder="Allergies (séparées par virgule)"
          value={form.allergies}
          onChange={e => setForm({ ...form, allergies: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
        />
        <div className="flex gap-4 mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.majeur}
              onChange={e => setForm({ ...form, majeur: e.target.checked })}
              className="mr-2"
            />
            Majeur
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.vegetarien}
              onChange={e => setForm({ ...form, vegetarien: e.target.checked })}
              className="mr-2"
            />
            Végétarien
          </label>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {editId ? 'Modifier' : 'Créer'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ nom: '', allergies: '', majeur: true, vegetarien: false });
            }}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        )}
      </form>

      <div className="space-y-2">
        {clients.map(c => (
          <div key={c.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <strong className="text-lg">{c.nom}</strong>
              <div className="text-sm text-gray-600">
                {c.allergies.length > 0 && `Allergies: ${c.allergies.join(', ')}`}
                {c.majeur && ' • Majeur'}
                {c.vegetarien && ' • Végétarien'}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(c)}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                Éditer
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
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
