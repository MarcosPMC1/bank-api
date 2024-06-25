import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updatePaymentDto: UpdatePaymentDto): string;
    remove(id: string): string;
}
