import { Injectable, NotFoundException } from '@nestjs/common';

import { paginationHelper } from '@/shared/utils/many-helper';
import { UserFilterDto } from '@/domain/user/dto/user-pagination.dto';

import { In, Not, Repository } from 'typeorm';
import { UserEntity } from '@/domain/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@/domain/user/dto/create-user.dto';
import { SUPER_ADMIN } from '@/shared/constants';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async findUserById(userId: string) {
    const userData = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['roles', 'organizations'],
    });

    if (!userData) {
      throw new NotFoundException('用户不存在');
    }

    return userData;
  }
  async findUserByUsername(username: string) {
    const userData = await this.userRepository.findOneBy({
      username,
    });

    if (!userData) {
      throw new NotFoundException('用户不存在');
    }

    return userData;
  }

  async create(dto: CreateUserDto) {
    const user = await this.userRepository.save(this.userRepository.create(dto));
    if (!user) {
      throw new NotFoundException('创建失败');
    }

    return user;
  }

  async findMany(
    dto: UserFilterDto & {
      include?: any;
    },
  ) {
    const pagination = paginationHelper(dto.page, dto.pageSize);

    const [list, count] = await this.userRepository.findAndCount({
      ...pagination,
      order: dto.orderBy,
      where: {
        username: Not(In([SUPER_ADMIN])),
      },
    });

    return { list, count, page: dto.page, pageSize: dto.pageSize };
  }
}
