// src/entities/client.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Commande } from './commande.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nom: string;

  @Column({ type: 'text', array: true, default: [] })
  allergies: string[];

  @Column({ type: 'boolean', default: false })
  majeur: boolean;

  @Column({ type: 'boolean', default: false })
  vegetarien: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.client)
  reservations: Reservation[];

  @OneToMany(() => Commande, (commande) => commande.client)
  commandes: Commande[];
}
