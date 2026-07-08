import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [plats, setPlats] = useState([]);
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ tableId: '', clientId: '', platId: '', prixTotal: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cmdData, clientsData, platsData, tablesData] = await Promise.all([
        api.getCommandes(),
        api.getClients(),
        api.getPlats(),
        api.getTables()
      ]);
      setCommandes(cmdData);
      setClients(clientsData);
      setPlats(platsData);
      setTables(tablesData);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      tableId: parseInt(form.tableId),
      clientId: parseInt(form.clientId),
      platId: parseInt(form.platId),
      prixTotal: parseFloat(form.prixTotal)
    };

    try {
      if (editId) {
        await api.updateCommande(editId, data);
      } else {
        await api.createCommande(data);
      }
      setForm({ tableId: '', clientId: '', platId: '', prixTotal: '' });
      setEditId(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteCommande(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (cmd) => {
    setEditId(cmd.id);
    setForm({
      tableId: cmd.tableId.toString(),
      clientId: cmd.clientId.toString(),
      platId: cmd.platId.toString(),
      prixTotal: cmd.prixTotal.toString()
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Commandes</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <select
          value={form.tableId}
          onChange={e => setForm({ ...form, tableId: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
          required
        >
          <option value="">Choisir une table</option>
          {tables.map(t => (
            <option key={t.id} value={t.id}>Table #{t.id}</option>
          ))}
        </select>
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
          value={form.platId}
          onChange={e => setForm({ ...form, platId: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
          required
        >
          <option value="">Choisir un plat</option>
          {plats.map(p => (
            <option key={p.id} value={p.id}>{p.nom} - {p.prix}€</option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Prix total"
          value={form.prixTotal}
          onChange={e => setForm({ ...form, prixTotal: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
          required
        />
        <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
          {editId ? 'Modifier' : 'Créer'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ tableId: '', clientId: '', platId: '', prixTotal: '' });
            }}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        )}
      </form>

      <div className="space-y-2">
        {commandes.map(cmd => {
          const client = clients.find(c => c.id === cmd.clientId);
          const plat = plats.find(p => p.id === cmd.platId);
          const table = tables.find(t => t.id === cmd.tableId);
          return (
            <div key={cmd.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <strong className="text-lg">Commande #{cmd.id}</strong>
                <div className="text-sm text-gray-600">
                  Table #{table?.id || 'N/A'} • {client?.nom || 'N/A'} • {plat?.nom || 'N/A'}
                </div>
                <div className="text-sm font-semibold text-orange-600">{cmd.prixTotal}€</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cmd)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  Éditer
                </button>
                <button
                  onClick={() => handleDelete(cmd.id)}
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
