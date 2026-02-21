import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment/payment.entity';
import { PassportModule } from '@nestjs/passport';
import { PaymentService } from './services/payment/payment.service';
import { PaymentController } from './controllers/payment/payment.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Payment]), PassportModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService, TypeOrmModule],
})
export class PaymentModule {}
