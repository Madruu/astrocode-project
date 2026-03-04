import {
  Controller,
  Post,
  HttpCode,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  Get,
  Query,
} from '@nestjs/common';
import {
  BlockBookingSlotDto,
  CancelBookingDto,
  CreateBookingDto,
  GetAvailableSlotsQueryDto,
} from 'src/booking/dto/booking/create-booking/create-booking.dto';
import { Booking } from 'src/booking/entities/booking/booking.entity';
import { BookingService } from 'src/booking/services/booking/booking.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post('create')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new booking' })
  create(
    @Req() req: Request & { user: { userId: number; accountType?: string } },
    @Body() booking: CreateBookingDto,
  ): Promise<Booking> {
    try {
      return this.bookingService.createBooking(
        booking,
        req.user.userId,
        req.user.accountType,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all bookings' })
  getBookings(
    @Req() req: Request & { user: { userId: number; accountType?: string } },
  ): Promise<Booking[]> {
    try {
      return this.bookingService.getBookings(
        req.user.userId,
        req.user.accountType,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('cancel')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Cancel a booking' })
  cancelBooking(
    @Req() req: Request & { user: { userId: number; accountType?: string } },
    @Body() cancelBookingDto: CancelBookingDto,
  ): Promise<Booking> {
    try {
      return this.bookingService.cancelBooking(
        cancelBookingDto,
        req.user.userId,
        req.user.accountType,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('block')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Block a task slot as provider account' })
  blockSlot(
    @Req() req: Request & { user: { userId: number; accountType?: string } },
    @Body() blockSlotDto: BlockBookingSlotDto,
  ): Promise<Booking> {
    try {
      return this.bookingService.blockBookingSlot(
        blockSlotDto,
        req.user.userId,
        req.user.accountType,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('available-slots')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get available slots for a task by day' })
  getAvailableSlots(
    @Query() query: GetAvailableSlotsQueryDto,
  ): Promise<string[]> {
    try {
      return this.bookingService.getAvailableSlots(query.taskId, query.date);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
