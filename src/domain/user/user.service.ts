import { Injectable, NotFoundException } from '@nestjs/common';
import { UserModel } from './types';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilterDto } from './dto/user-pagination.dto';
import { paginationHelper } from '../../common/utils/many-helper';
import { SUPER_ADMIN } from '../../common/constants';

function formatUser(user: UserModel) {
  return {
    ...user,
    roles: user.roles.map((v) => v.role),
    organizations: user.organizations.map((v) => v.organization),
  };
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserById(userId: string) {
    const userData = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        organizations: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!userData) {
      throw new NotFoundException('用户不存在');
    }

    return formatUser(userData);
  }
  async findUserByUsername(username: string) {
    const userData = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!userData) {
      throw new NotFoundException('用户不存在');
    }

    return userData;
  }

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: dto,
    });
    if (!user) {
      throw new NotFoundException('创建失败');
    }

    return user;
  }

  async findMany(
    dto: UserFilterDto & {
      include?: never;
    },
  ) {
    const pagination = paginationHelper(dto.page, dto.pageSize);

    const [list, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        ...pagination,
        orderBy: dto.orderBy,
        where: {
          username: { notIn: [SUPER_ADMIN] },
        },
      }),
      this.prisma.user.count({
        orderBy: dto.orderBy,
        where: {
          username: { notIn: [SUPER_ADMIN] },
        },
      }),
    ]);

    return { list, count, page: dto.page, pageSize: dto.pageSize };
  }
}
