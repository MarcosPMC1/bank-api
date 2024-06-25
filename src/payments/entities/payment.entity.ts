import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  idaccount: string;

  @Column({ type: 'numeric' })
  value: number;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'varchar', length: 255 })
  description: string;
}
