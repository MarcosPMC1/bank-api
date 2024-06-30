import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class ReportPaymentDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
