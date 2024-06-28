import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

  create(createAccountDto: CreateAccountDto) {
    return this.accountRepository.save(this.accountRepository.create(createAccountDto))
  }

  findAll() {
    return this.accountRepository.find();
  }

  async findOne(id: string) {
    return this.accountRepository.findOneOrFail({ where: { id } }).catch(() => {throw new NotFoundException()})
  }

  async remove(id: string) {
    await this.accountRepository.softDelete(id)
    return { msg: 'Success Deleted' }
  }
}
