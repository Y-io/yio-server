import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoleEntity } from '@/domain/role/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>) {}
  async findMany() {
    return this.roleRepository.find({
      relations: {
        users: true,
      },
    });
  }
}
