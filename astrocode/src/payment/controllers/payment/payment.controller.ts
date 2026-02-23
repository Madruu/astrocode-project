import { BadRequestException, Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { CreatePaymentDto } from 'src/payment/dto/create-payment/create-payment.dto';
import { Payment } from 'src/payment/entities/payment/payment.entity';
import { PaymentService } from 'src/payment/services/payment/payment.service';
import { Post, Get, HttpCode, Body } from '@nestjs/common';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { Booking } from 'src/booking/entities/booking/booking.entity';
import { PurchaseTaskDto } from 'src/task/dto/create-task.dto/create-task.dto';
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new payment for account balance' })
  createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      return this.paymentService.createPayment(createPaymentDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all payments' })
  getPayments(
    @Req() req: Request & { user: { userId: number } },
  ): Promise<Payment[]> {
    try {
      return this.paymentService.getPaymentsByUserId(req.user.userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('purchase-task')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Purchase a task directly from account balance' })
  purchaseTask(@Body() purchaseTaskDto: PurchaseTaskDto): Promise<Booking> {
    try {
      return this.paymentService.purchaseTask(purchaseTaskDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
