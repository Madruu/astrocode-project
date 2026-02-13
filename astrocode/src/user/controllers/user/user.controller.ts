import { Controller, Get, HttpCode, Post, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all users' })
  findAll(): string {
    return 'All users';
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  create(): string {
    return 'Create user';
  }

  @Put()
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a user' })
  update(): string {
    return 'Update user';
  }
}
