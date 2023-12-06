import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { MenuType } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}
  async list() {
    return this.prisma.menu.findMany();
  }
  async findMany(parentId?: string) {
    if (!parentId) {
      return this.prisma.menu.findMany();
    }

    const parentMenu = await this.findById(parentId);
    if (!parentMenu) {
      throw new NotFoundException('未找到');
    }

    return this.prisma.menu.findMany();
  }

  async findById(id?: string) {
    const parentMenu = await this.prisma.menu.findUnique({
      where: {
        id: id,
      },
    });
    if (!parentMenu) {
      throw new NotFoundException('未找到');
    }

    return this.prisma.menu.findMany();
  }

  async create(dto: CreateMenuDto) {
    const { parentId, ...data } = dto;

    const menu = await this.prisma.menu.findUnique({
      where: {
        identify: dto.identify,
      },
    });

    if (menu) throw new NotFoundException('该标识已存在');

    if (parentId) {
      const parentMenu = await this.prisma.menu.findUnique({
        where: {
          id: parentId,
        },
      });

      if (parentMenu.type !== MenuType.DIRECTORY) {
        throw new NotFoundException('不能在非目录下创建子目录');
      }

      await this.prisma.menu.create({
        data: {
          name: data.name,
          identify: data.identify,
          type: data.type,
          parent: {
            connect: {
              id: parentId,
              // parentId: parentId,
            },
          },
        },
      });

      return;
    }

    return this.prisma.menu.create({
      data: data,
    });
  }

  async deleteById(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: {
        id: id,
      },
      include: {
        subMenus: {
          include: {
            subMenus: true,
          },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException('不存在');
    } else if (menu.subMenus.length) {
      throw new NotFoundException('有子项，不允许删除');
    }
    await this.prisma.menu.delete({
      where: { id },
    });
  }
}
