import { Type } from "class-transformer"
import { IsNumber, IsPositive, IsString } from "class-validator"

export class CreatePaymentDto {
    @IsString()
    sender: string

    @IsString()
    receiver: string

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    value: number

    @IsString()
    description: string
}
