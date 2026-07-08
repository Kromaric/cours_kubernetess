import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Plats() {
  const [plats, setPlats] = useState([]);
  const [form, setForm] = useState({ nom: '', prix: '', description: '', allergenes: '', vegetarien: false });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadPlats();
  }, []);

  const loadPlats = async () => {
    try {
      const data = await api.getPlats();
      setPlats(data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      prix: parseFloat(form.prix),
      allergenes: form.allergenes.split(',').map(a => a.trim()).filter(Boolean)
    };

    try {
      if (editId) {
        await api.updatePlat(editId, data);
      } else {
        await api.createPlat(data);
      }
      setForm({ nom: '', prix: '', description: '', allergenes: '', vegetarien: false });
      setEditId(null);
      loadPlats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deletePlat(id);
      loadPlats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (plat) => {
    setEditId(plat.id);
    setForm({
      nom: plat.nom,
      prix: plat.prix.toString(),
      description: plat.description,
      allergenes: plat.allergenes.join(', '),
      vegetarien: plat.vegetarien
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Plats</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <input
          placeholder="Nom du plat"
          value={form.nom}
          onChange={e => setForm({ ...form, nom: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Prix"
          value={form.prix}
          onChange={e => setForm({ ...form, prix: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
          rows="2"
        />
        <input
          placeholder="Allergènes (séparés par virgule)"
          value={form.allergenes}
          onChange={e => setForm({ ...form, allergenes: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
        />
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={form.vegetarien}
            onChange={e => setForm({ ...form, vegetarien: e.target.checked })}
            className="mr-2"
          />
          Végétarien
        </label>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          {editId ? 'Modifier' : 'Créer'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ nom: '', prix: '', description: '', allergenes: '', vegetarien: false });
            }}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        )}
      </form>

      <div className="space-y-2">
        {plats.map(p => (
          <div key={p.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <strong className="text-lg">{p.nom}</strong> - <span className="text-green-600 font-semibold">{p.prix}€</span>
              <div className="text-sm text-gray-600">{p.description}</div>
              <div className="text-xs text-gray-500">
                {p.allergenes.length > 0 && `Allergènes: ${p.allergenes.join(', ')}`}
                {p.vegetarien && ' • Végétarien'}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(p)}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                Éditer
              </button>
              <button
                onClick={() => handleDelete(p.id)}
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
