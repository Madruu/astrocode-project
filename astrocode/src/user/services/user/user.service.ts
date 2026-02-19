import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    // Here, with transactions, we ensure user creation is atomic (Either all or nothing).
    const resultUser = await this.dataSource.transaction(
      async (transactionManager) => {
        const newUser = transactionManager.create(User, {
          ...createUserDto,
          password: hashedPassword,
        });
        return transactionManager.save(User, newUser);
      },
    );

    return resultUser;
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

  async addMoneyToUserBalance(id: number, amount: number): Promise<User> {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const currentBalance = Number(userToUpdate.balance);
    if (!Number.isFinite(currentBalance)) {
      throw new BadRequestException('Invalid user balance');
    }

    const newBalance = currentBalance + amount;
    if (newBalance > 1000000) {
      throw new BadRequestException('User balance cannot exceed 1000000');
    }
    return this.userRepository.save({
      ...userToUpdate,
      balance: newBalance,
    });
  }

  //Add service to purchase a task
}
