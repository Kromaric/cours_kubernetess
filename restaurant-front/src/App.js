import React, { useState } from 'react';
import Clients from './components/Clients';
import Plats from './components/Plats';
import Tables from './components/Tables';
import Reservations from './components/Reservations';
import Commandes from './components/Commandes';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('clients');

  const tabs = [
    { id: 'clients', label: 'Clients', component: Clients },
    { id: 'plats', label: 'Plats', component: Plats },
    { id: 'tables', label: 'Tables', component: Tables },
    { id: 'reservations', label: 'Réservations', component: Reservations },
    { id: 'commandes', label: 'Commandes', component: Commandes }
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          🍽️ Gestion Restaurant
        </h1>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}

export default App;
