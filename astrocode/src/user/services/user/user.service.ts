import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(user: CreateUserDto): Promise<User> {
    return this.userRepository.save({ ...user, balance: 0 });
  }

  async updateUser(id: number, user: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.save({ ...userToUpdate, ...user });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
