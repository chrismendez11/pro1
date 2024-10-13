import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from 'src/shared/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUserByEmail(email: string) {
    return this.usersRepository.getUserByEmail(email);
  }

  getUserById(userId: string): Promise<User> {
    return this.usersRepository.getUserById(userId);
  }
}
