import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  idreceiver: string;

  @Column({ type: 'uuid' })
  idsender: string;

  @Column({ type: 'numeric' })
  value: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: Date;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @ManyToOne(() => Account, account => account.receiver)
  @JoinColumn({ name: 'idreceiver' })
  receiver: Account

  @ManyToOne(() => Account, account => account.sender)
  @JoinColumn({ name: 'idsender' })
  sender: Account
}
