import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo(): object {
    return {
      message: 'API REST Restaurant - Gestion de CRUD',
      version: '1.0.0',
      endpoints: {
        clients: {
          'GET /clients': 'Liste tous les clients',
          'GET /clients/:id': 'Récupère un client par son ID',
          'POST /clients': 'Crée un nouveau client',
          'PUT /clients/:id': 'Modifie un client',
          'DELETE /clients/:id': 'Supprime un client',
        },
        plats: {
          'GET /plats': 'Liste tous les plats',
          'GET /plats/:id': 'Récupère un plat par son ID',
          'POST /plats': 'Crée un nouveau plat',
          'PUT /plats/:id': 'Modifie un plat',
          'DELETE /plats/:id': 'Supprime un plat',
        },
        tables: {
          'GET /tables': 'Liste toutes les tables',
          'GET /tables/:id': 'Récupère une table par son ID',
          'POST /tables': 'Crée une nouvelle table',
          'PUT /tables/:id': 'Modifie une table',
          'DELETE /tables/:id': 'Supprime une table',
        },
        reservations: {
          'GET /reservations': 'Liste toutes les réservations',
          'GET /reservations/:id': 'Récupère une réservation par son ID',
          'POST /reservations': 'Crée une nouvelle réservation',
          'PUT /reservations/:id': 'Modifie une réservation',
          'DELETE /reservations/:id': 'Supprime une réservation',
          'GET /errors': 'provoque une erreur pour tester la gestion des erreurs',
        },
        commandes: {
          'GET /commandes': 'Liste toutes les commandes',
          'GET /commandes/:id': 'Récupère une commande par son ID',
          'POST /commandes': 'Crée une nouvelle commande',
          'PUT /commandes/:id': 'Modifie une commande',
          'DELETE /commandes/:id': 'Supprime une commande',
        },
      },
    };
  }
}
