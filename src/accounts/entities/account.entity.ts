import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  account_type: 'POUPANCA' | 'CORRENTE'

  @Column({ type: 'numeric' })
  balance: number

  @OneToMany(() => Payment, payment => payment.receiver)
  receiver: Payment

  @OneToMany(() => Payment, payment => payment.sender)
  sender: Payment
}
