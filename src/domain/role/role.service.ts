import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../notification/services/notification.service';

@Injectable()
export class RoleService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  // 查找所有
  async findMany() {
    return this.prisma.role.findMany();
  }

  // 查找角色
  async findRoleById(id: string) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: id,
      },
      include: {
        menus: {
          include: {
            menu: true,
          },
        },
      },
    });

    if (role) {
      // 该角色已存在
      throw new BadRequestException('角色已存在');
    }
    return role;
  }

  // 创建角色
  async createRole(dto: CreateRoleDto) {
    const role = await this.prisma.role.findUnique({
      where: { name: dto.name },
    });

    if (role) {
      // 该角色已存在
      throw new BadRequestException('角色已存在');
    }

    await this.setPermissions(role.id, dto.permissionIds);
  }

  // 设置权限
  async setPermissions(id: string, permissionIds: string[]) {
    await this.findRoleById(id);

    const permissions = await this.prisma.permission.findMany({
      where: { id: { in: permissionIds } },
    });

    permissionIds.forEach((permissionId) => {
      const exist = permissions.find((permission) => permission.id === permissionId);
      if (!exist) {
        throw new NotFoundException(`${permissionId} 的权限 ID 不存在`);
      }
    });

    // await this.prisma.role.update({
    //   where: {
    //     id,
    //   },
    //   data: {
    //     permissions: {
    //       create: permissionIds.map((permissionId) => ({
    //         permissionId,
    //       })),
    //     },
    //   },
    // });

    // this.notificationService.create();
  }

  // 删除角色
  async deleteRoleById(id: string) {
    await this.findRoleById(id);

    await this.prisma.role.delete({
      where: {
        id,
      },
    });
  }
}
