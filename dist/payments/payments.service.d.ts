import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsService {
    create(createPaymentDto: CreatePaymentDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePaymentDto: UpdatePaymentDto): string;
    remove(id: number): string;
}
