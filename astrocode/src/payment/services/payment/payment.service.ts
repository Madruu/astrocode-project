import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Payment } from 'src/payment/entities/payment/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentDto } from 'src/payment/dto/create-payment/create-payment.dto';
import { User } from 'src/user/entities/user/user.entity';
import { Booking } from 'src/booking/entities/booking/booking.entity';
import { Task } from 'src/task/entities/task/task.entity';
import { PurchaseTaskDto } from 'src/task/dto/create-task.dto/create-task.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.dataSource.transaction(async (manager) => {
      const payment = manager.create(Payment, createPaymentDto);
      const user = await manager.findOne(User, {
        where: { id: createPaymentDto.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const paymentAmount = Number(createPaymentDto.amount);
      if (!Number.isFinite(paymentAmount)) {
        throw new BadRequestException('Invalid payment amount');
      }

      const currentBalance = Number(user.balance);
      if (!Number.isFinite(currentBalance)) {
        throw new BadRequestException('Invalid user balance');
      }
      const newBalance = currentBalance + paymentAmount;
      if (newBalance > 1000000) {
        throw new BadRequestException('User balance cannot exceed 1000000');
      }
      user.balance = newBalance;
      payment.user = user;
      await manager.save(user);
      const savedPayment = await manager.save(payment);
      return savedPayment;
    });
  }

  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    const payments = await this.paymentRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (payments.length === 0) {
      throw new NotFoundException('Payments not found');
    }
    console.log(userId);
    return payments;
  }

  async purchaseTask(purchaseTaskDto: PurchaseTaskDto): Promise<Booking> {
    return this.dataSource.transaction(async (manager) => {
      const task = await manager.findOne(Task, {
        where: { id: purchaseTaskDto.taskId },
      });
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      const user = await manager.findOne(User, {
        where: { id: purchaseTaskDto.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.balance < task.price) {
        throw new BadRequestException('Insufficient balance');
      }
      user.balance -= task.price;
      await manager.save(user);
      const booking = manager.create(Booking, {
        task,
        user,
        scheduledDate: new Date(),
        status: 'booked',
        paid: true,
      });
      return manager.save(booking);
    });
  }
}
