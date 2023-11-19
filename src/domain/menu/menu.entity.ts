import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';
import { YioBaseEntity } from '@/shared/yio-base.entity';
import { Transform } from 'class-transformer';

export enum MenuTypeEnum {
  DIRECTORY = 'directory',
  BUTTON = 'button',
}

@Entity('menu')
@Tree('materialized-path')
export class MenuEntity extends YioBaseEntity {
  @Column()
  name: string;

  @Column({
    unique: true,
  })
  identify: string;

  @Column({ type: 'enum', enum: MenuTypeEnum })
  type: MenuTypeEnum;

  @TreeChildren()
  @Transform(({ value }) => (!value || value.length <= 0 ? [{ name: '1' }] : value), {
    toPlainOnly: true,
  })
  children: MenuEntity[];

  @TreeParent()
  parent: MenuEntity;
}
