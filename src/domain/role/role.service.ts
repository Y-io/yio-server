import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { RoleEntity } from '@/domain/role/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from '@/domain/role/dto/create-role.dto';
import { PermissionEntity } from '@/domain/system-module/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity) private permissionRepo: Repository<PermissionEntity>,
  ) {}

  // 查找所有
  async findMany() {
    return this.roleRepo.find({
      relations: {
        users: true,
      },
    });
  }

  // 查找角色
  async findRoleById(id: string) {
    const role = await this.roleRepo.findOne({
      where: {
        id: id,
      },
      relations: ['permissions'],
    });

    if (role) {
      // 该角色已存在
      throw new BadRequestException('角色已存在');
    }
    return role;
  }

  // 创建角色
  async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepo.findOneBy({
      name: dto.name,
    });

    if (role) {
      // 该角色已存在
      throw new BadRequestException('角色已存在');
    }

    await this.setPermissions(role.id, dto.permissionIds);
  }

  // 设置权限
  async setPermissions(id: string, permissionIds: string[]) {
    const role = await this.findRoleById(id);

    const permissions = await this.permissionRepo.findBy({
      id: In(permissionIds),
    });

    permissionIds.forEach((permissionId) => {
      const exist = permissions.find((permission) => permission.id === permissionId);
      if (!exist) {
        throw new NotFoundException(`${permissionId} 的权限 ID 不存在`);
      }
    });

    role.permissions = permissions;
    await this.roleRepo.save(role);
  }

  // 删除角色
  async deleteRoleById(id: string) {
    const role = await this.findRoleById(id);
    try {
      await this.roleRepo
        .createQueryBuilder('role')
        .relation(RoleEntity, 'permissions')
        .of(role)
        .remove(role.permissions);
      await this.roleRepo.save(role);
    } catch (e) {
      throw new HttpException('数据库错误', 500);
    }
  }
}
