import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { RoleEntity } from '@/domain/role/role.entity';
import { YioBaseEntity } from '@/shared/yio-base.entity';
import { OrganizationEntity } from '@/domain/organization/organization.entity';
import { Expose } from 'class-transformer';

@Entity('user')
export class UserEntity extends YioBaseEntity {
  @Expose()
  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @Expose()
  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];

  @Expose()
  @ManyToMany(() => OrganizationEntity, (organization) => organization.users)
  @JoinTable()
  organizations: OrganizationEntity[];
}
