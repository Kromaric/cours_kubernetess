// src/entities/plat.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Commande } from './commande.entity';

@Entity('plats')
export class Plat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nom: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  prix: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', array: true, default: [] })
  allergenes: string[];

  @Column({ type: 'boolean', default: false })
  vegetarien: boolean;

  @OneToMany(() => Commande, (commande) => commande.plat)
  commandes: Commande[];
}
