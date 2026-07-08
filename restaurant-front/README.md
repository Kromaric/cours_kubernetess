# Restaurant Front

Interface React pour l'API de gestion de restaurant.

## Configuration

1. Modifie l'URL de l'API dans `src/config/api.js`
2. Remplace `https://TON-URL-CLOUD-RUN.run.app` par ton URL Cloud Run

## Installation

```bash
npm install
```

## Lancement

```bash
npm start
```

L'app démarre sur http://localhost:3000

## Structure

```
src/
├── components/       # Composants React (Clients, Plats, Tables, etc.)
├── services/         # Service API
├── config/          # Configuration (URL API)
├── App.js           # Composant principal
└── index.js         # Point d'entrée
```

## Fonctionnalités

- ✅ Gestion des clients (allergies, végétarien, majeur)
- ✅ Gestion des plats (prix, description, allergènes)
- ✅ Gestion des tables (capacité, statut)
- ✅ Gestion des réservations
- ✅ Gestion des commandes
