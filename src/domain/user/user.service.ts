import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserData(userId: string) {
    const userData = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userData) {
      throw new NotFoundException('用户不存在');
    }

    return userData;
  }
}
