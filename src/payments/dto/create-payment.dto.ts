import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsPositive, IsString } from "class-validator"

export class CreatePaymentDto {
    @ApiProperty()
    @IsString()
    sender: string

    @ApiProperty()
    @IsString()
    receiver: string

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    value: number

    @ApiProperty()
    @IsString()
    description: string
}
