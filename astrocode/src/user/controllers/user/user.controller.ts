import {
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto/create-user.dto';
import { User } from 'src/user/entities/user/user.entity';
import { UserService } from 'src/user/services/user/user.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all users' })
  findAll(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.createUser(user);
  }

  @Put()
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a user' })
  update(): string {
    return 'Update user';
  }
}
