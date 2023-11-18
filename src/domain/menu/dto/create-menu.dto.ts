import { IsEnum, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { MenuTypeEnum } from '@/domain/menu/menu.entity';

export class CreateMenuDto {
  @IsUUID()
  @IsOptional()
  parentId: string;
  @IsString()
  name: string;
  @IsString()
  identify: string;
  @IsEnum(MenuTypeEnum)
  type: MenuTypeEnum;
}
