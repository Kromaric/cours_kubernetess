// src/entities/reservation.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Table } from './table.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  clientId: number;

  @Column({ type: 'int' })
  tableId: number;

  @ManyToOne(() => Client, (client) => client.reservations)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToOne(() => Table, (table) => table.reservations)
  @JoinColumn({ name: 'tableId' })
  table: Table;
}
