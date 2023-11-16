import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  paginationHelper,
  transformObjToArr,
  whereInputHelper,
} from '@/shared/utils/many-helper';
import { Prisma } from '@prisma/client';
import { UserPaginationDto } from '@/domain/user/dto/user-pagination.dto';

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

  async findMany(dto?: UserPaginationDto) {
    const { page, size, filter } = dto;

    const pagination = paginationHelper(page, size);
    const where: Prisma.UserWhereInput = whereInputHelper(filter);
    const orderBy: Prisma.UserOrderByWithRelationInput[] = transformObjToArr(
      dto.orderBy,
    );

    const queryArgs = {
      ...pagination,
      where,
      orderBy,
    };

    const [data, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        ...queryArgs,
        include: {
          organizations: true,
          roles: true,
        },
      }),
      this.prisma.user.count(queryArgs),
    ]);

    return { list: data, page, size, count: count };
  }
}
