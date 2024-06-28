import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEnum, IsNumber, IsPositive, IsString, Min } from "class-validator"

export class CreateAccountDto {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    @IsEnum(['POUPANCA', 'CORRENTE'])
    account_type: 'POUPANCA' | 'CORRENTE'

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    balance: number
}
