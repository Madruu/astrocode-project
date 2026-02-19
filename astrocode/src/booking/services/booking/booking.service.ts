import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from 'src/booking/entities/booking/booking.entity';
import { DataSource } from 'typeorm';
import { CreateBookingDto } from 'src/booking/dto/booking/create-booking/create-booking.dto';
import { Task } from 'src/task/entities/task/task.entity';
import { User } from 'src/user/entities/user/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private dataSource: DataSource,
  ) {}

  async createBooking(
    bookingDto: CreateBookingDto,
    userId: number,
  ): Promise<Booking> {
    const scheduledDate = new Date(bookingDto.scheduledDate);

    if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
      throw new BadRequestException('Invalid or past date');
    }

    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id: userId },
      });

      const task = await manager.findOne(Task, {
        where: { id: bookingDto.taskId },
      });

      if (!user || !task) {
        throw new NotFoundException();
      }

      if (user.balance < task.price) {
        throw new BadRequestException('Insufficient balance');
      }

      const existingBooking = await manager.findOne(Booking, {
        where: {
          task: { id: task.id },
          scheduledDate,
        },
      });

      if (existingBooking) {
        throw new BadRequestException('Time slot already booked');
      }

      user.balance -= Number(task.price);
      await manager.save(user);

      const newBooking = manager.create(Booking, {
        scheduledDate,
        user,
        task,
      });

      return manager.save(newBooking);
    });
  }

  async getBookings(userId: number): Promise<Booking[]> {
    const foundBookings = await this.bookingRepository.find({
      where: { user: { id: userId } },
    });
    if (!foundBookings) {
      throw new NotFoundException('Bookings not found');
    }
    return foundBookings;
  }
}
