import { Type } from "class-transformer"
import { IsNumber, IsPositive, Min } from "class-validator"

export class CreateAccountDto {
    nome: string
    tipo_conta: 'POUPANCA' | 'CORRENTE'

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    saldo: number
}
