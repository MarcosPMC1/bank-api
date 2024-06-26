import { Type } from "class-transformer"
import { IsEnum, IsNumber, IsPositive, IsString, Min } from "class-validator"

export class CreateAccountDto {
    @IsString()
    name: string

    @IsString()
    @IsEnum(['POUPANCA', 'CORRENTE'])
    account_type: 'POUPANCA' | 'CORRENTE'

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    balance: number
}
