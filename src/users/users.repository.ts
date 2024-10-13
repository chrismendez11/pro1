import { Injectable } from '@nestjs/common';
import { User } from 'src/shared/interfaces/user.interface';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getUserByEmail(userEmail: string) {
    return this.prismaService.user.findUnique({
      where: {
        userEmail,
      },
      select: {
        userId: true,
        userName: true,
        userEmail: true,
        userPassword: true,
      },
    });
  }

  getUserById(userId: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        userId,
      },
      select: {
        userId: true,
        userName: true,
        userEmail: true,
        roleId: true,
        companyId: true,
      },
    });
  }
}
