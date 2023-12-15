import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { formatUser } from '../../../common/utils/user.util';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}
  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        organizations: {
          include: {
            organization: true,
          },
        },
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return formatUser(user);
  }

  async updateProfile(id: string, dto: any) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: dto,
    });

    if (!user) throw new NotFoundException('用户不存在');

    return user;
  }
}
