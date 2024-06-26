import { Type } from "class-transformer"
import { IsDate, IsOptional, IsString } from "class-validator"

export class ReportPaymentDto{
    @IsString()
    @IsOptional()
    sender: string

    @Type(() => Date)
    @IsDate()
    startDate: Date

    @Type(() => Date)
    @IsDate()
    endDate: Date
}