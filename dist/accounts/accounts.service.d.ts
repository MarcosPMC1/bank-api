import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
export declare class AccountsService {
    create(createAccountDto: CreateAccountDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAccountDto: UpdateAccountDto): string;
    remove(id: number): string;
}
