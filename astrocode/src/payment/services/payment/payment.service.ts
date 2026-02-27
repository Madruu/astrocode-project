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

export interface WalletSummary {
  balance: number;
  currency: string;
  totalDeposits: number;
  totalCharges: number;
  totalRefunds: number;
  pendingTransactions: number;
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createPayment(
    userId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.dataSource.transaction(async (manager) => {
      if (!Number.isInteger(userId)) {
        throw new BadRequestException('User id is required');
      }
      const user = await manager.findOne(User, {
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const paymentAmount = Number(createPaymentDto.amount);
      if (!Number.isFinite(paymentAmount)) {
        throw new BadRequestException('Invalid payment amount');
      }
      if (paymentAmount <= 0) {
        throw new BadRequestException('Payment amount must be greater than 0');
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
      await manager.save(user);

      const payment = manager.create(Payment, {
        amount: paymentAmount,
        currency: createPaymentDto.currency,
        type: 'DEPOSIT',
        status: 'COMPLETED',
        description: createPaymentDto.description ?? 'Deposito na carteira',
        reference: createPaymentDto.reference ?? null,
        user,
      });
      const savedPayment = await manager.save(payment);
      return savedPayment;
    });
  }

  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getWalletSummaryByUserId(userId: number): Promise<WalletSummary> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['payments'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payments = user.payments ?? [];
    const totalDeposits = payments
      .filter(
        (payment) =>
          payment.type === 'DEPOSIT' && payment.status === 'COMPLETED',
      )
      .reduce((total, payment) => total + Number(payment.amount), 0);

    const totalCharges = payments
      .filter(
        (payment) =>
          payment.type === 'BOOKING_CHARGE' && payment.status === 'COMPLETED',
      )
      .reduce((total, payment) => total + Number(payment.amount), 0);

    const totalRefunds = payments
      .filter(
        (payment) =>
          payment.type === 'BOOKING_REFUND' && payment.status === 'COMPLETED',
      )
      .reduce((total, payment) => total + Number(payment.amount), 0);

    const pendingTransactions = payments.filter(
      (payment) => payment.status === 'PENDING',
    ).length;

    return {
      balance: Number(user.balance ?? 0),
      currency: 'BRL',
      totalDeposits,
      totalCharges,
      totalRefunds,
      pendingTransactions,
    };
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
      const currentBalance = Number(user.balance);
      const taskPrice = Number(task.price);
      if (!Number.isFinite(currentBalance) || !Number.isFinite(taskPrice)) {
        throw new BadRequestException('Invalid balance or task price');
      }
      if (currentBalance < taskPrice) {
        throw new BadRequestException('Insufficient balance');
      }
      user.balance = currentBalance - taskPrice;
      await manager.save(user);
      const taskPayment = manager.create(Payment, {
        amount: taskPrice,
        currency: 'BRL',
        type: 'BOOKING_CHARGE',
        status: 'COMPLETED',
        reference: `BOOKING-${task.id}-${Date.now()}`,
        description: `Pagamento do agendamento para ${task.title}`,
        user,
      });
      await manager.save(taskPayment);
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
