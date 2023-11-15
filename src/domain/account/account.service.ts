import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/domain/user/user.service';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getProfile(userId: string) {
    const userData = await this.userService.getUserData(userId);

    return userData;
  }
}
