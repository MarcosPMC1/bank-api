import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 3,
          ttl: 60
        }
      ]
    })
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class PaymentsModule {}
