import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking/booking.entity';
import { User } from 'src/user/entities/user/user.entity';
import { Task } from 'src/task/entities/task/task.entity';
import { Payment } from 'src/payment/entities/payment/payment.entity';
import { PassportModule } from '@nestjs/passport';
import { BookingController } from './controllers/booking/booking.controller';
import { BookingService } from './services/booking/booking.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User, Task, Payment]),
    PassportModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService, TypeOrmModule],
})
export class BookingModule {}
