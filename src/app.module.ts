import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        username: configService.getOrThrow('POSTGRES_USER'),
        database: configService.getOrThrow('POSTGRES_DB'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        host: configService.getOrThrow('POSTGRES_HOST'),
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true
      }),
    }),
    AuthModule,
    AccountsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
