import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity, MenuTypeEnum } from '@/domain/menu/menu.entity';

import { CreateMenuDto } from '@/domain/menu/dto/create-menu.dto';
import { TreeRepository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(@InjectRepository(MenuEntity) private menuRepo: TreeRepository<MenuEntity>) {}

  async findMany(parentId?: string) {
    if (!parentId) {
      return this.menuRepo.findTrees();
    }

    const parentMenu = await this.findById(parentId);
    if (!parentMenu) {
      throw new NotFoundException('未找到');
    }

    return this.menuRepo.findDescendantsTree(parentMenu);
  }

  async findById(id?: string) {
    const parentMenu = await this.menuRepo.findOneBy({
      id: id,
    });
    if (!parentMenu) {
      throw new NotFoundException('未找到');
    }

    return this.menuRepo.findDescendantsTree(parentMenu);
  }

  async create(dto: CreateMenuDto) {
    const { parentId, ...data } = dto;
    const menu = await this.menuRepo.findOneBy({
      identify: dto.identify,
    });

    if (menu) throw new NotFoundException('该标识已存在');

    if (parentId) {
      const parentMenu = await this.findById(parentId);

      if (!parentMenu) {
        throw new NotFoundException('未找到父菜单');
      } else if (parentMenu.type !== MenuTypeEnum.DIRECTORY) {
        throw new NotFoundException('不能在非目录下创建子目录');
      }
      return await this.menuRepo.save(
        this.menuRepo.create({
          name: data.name,
          identify: data.identify,
          type: data.type,
          parent: parentMenu,
        }),
      );
    }

    return await this.menuRepo.save(this.menuRepo.create(data));
  }

  async deleteById(id: string) {
    const menu = await this.findById(id);

    if (!menu) {
      throw new NotFoundException('不存在');
    } else if (menu.children.length) {
      throw new NotFoundException('有子项，不允许删除');
    }
    await this.menuRepo.delete(id);
  }
}
