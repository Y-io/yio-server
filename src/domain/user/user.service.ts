import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { paginationHelper } from '../../common/utils/many-helper';
import { SUPER_ADMIN } from '../../common/constants';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { formatUser } from '../../common/utils/user.util';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const userData = await this.prisma.user.findUnique({
      where: {
        id: id,
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

    if (!userData) throw new NotFoundException('用户不存在');

    return formatUser(userData);
  }

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: dto,
    });
    if (!user) throw new NotFoundException('创建失败');

    return user;
  }
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: dto,
    });

    if (!user) throw new NotFoundException('用户不存在');

    return user;
  }

  async delete(id: string) {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('用户不存在');

    return user;
  }

  async findMany(
    dto: FindUsersDto & {
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
