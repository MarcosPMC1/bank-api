import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 50 })
  tipo_conta: 'POUPANCA' | 'CORRENTE'

  @Column({ type: 'numeric' })
  saldo: number
}
