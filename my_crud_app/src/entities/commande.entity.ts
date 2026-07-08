// src/entities/commande.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Table } from './table.entity';
import { Plat } from './plat.entity';

@Entity('commandes')
export class Commande {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'int' })
  tableId: number;

  @Column({ type: 'int' })
  clientId: number;

  @Column({ type: 'int' })
  platId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  prixTotal: number;

  @ManyToOne(() => Client, (client) => client.commandes)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToOne(() => Table, (table) => table.commandes)
  @JoinColumn({ name: 'tableId' })
  table: Table;

  @ManyToOne(() => Plat, (plat) => plat.commandes)
  @JoinColumn({ name: 'platId' })
  plat: Plat;
}
