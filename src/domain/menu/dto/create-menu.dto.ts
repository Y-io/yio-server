import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { MenuType } from '@prisma/client';

export class CreateMenuDto {
  @IsUUID()
  @IsOptional()
  parentId: string;
  @IsString()
  name: string;
  @IsString()
  identify: string;
  @IsEnum(MenuType)
  type: MenuType;
}
