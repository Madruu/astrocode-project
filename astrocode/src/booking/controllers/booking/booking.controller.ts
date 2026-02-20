import {
  Controller,
  Post,
  HttpCode,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { CreateBookingDto } from 'src/booking/dto/booking/create-booking/create-booking.dto';
import { Booking } from 'src/booking/entities/booking/booking.entity';
import { BookingService } from 'src/booking/services/booking/booking.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { User } from 'src/user/entities/user/user.entity';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post('create')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new booking' })
  create(@Body() booking: CreateBookingDto): Promise<Booking> {
    try {
      return this.bookingService.createBooking(booking);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all bookings' })
  getBookings(@Req() req: Request & { user: User }): Promise<Booking[]> {
    try {
      const userId = req.user.id;
      return this.bookingService.getBookings(userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
