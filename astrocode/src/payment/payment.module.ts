import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment/payment.entity';
import { PassportModule } from '@nestjs/passport';
import { PaymentService } from './services/payment/payment.service';
import { PaymentController } from './controllers/payment/payment.controller';
import { User } from 'src/user/entities/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { Task } from 'src/task/entities/task/task.entity';
import { Booking } from 'src/booking/entities/booking/booking.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, User, Task, Booking]),
    PassportModule,
    UserModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService, TypeOrmModule],
})
export class PaymentModule {}
