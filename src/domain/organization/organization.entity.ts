import { Column, Entity, ManyToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { YioBaseEntity } from '@/shared/yio-base.entity';
import { UserEntity } from '@/domain/user/user.entity';

@Entity('organization')
@Tree('materialized-path')
export class OrganizationEntity extends YioBaseEntity {
  @Column()
  name: string;

  @Column({
    unique: true,
  })
  identify: string;

  @TreeChildren()
  children: OrganizationEntity[];

  @TreeParent()
  parent: OrganizationEntity;

  @ManyToMany(() => UserEntity, (user) => user.organizations)
  users: UserEntity[];
}
