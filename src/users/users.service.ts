import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUserByEmail(email: string) {
    return this.usersRepository.getUserByEmail(email);
  }

  getUserById(userId: string) {
    return this.usersRepository.getUserById(userId);
  }
}
