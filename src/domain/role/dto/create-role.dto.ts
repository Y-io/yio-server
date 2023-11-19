import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({
    each: true,
  })
  @IsOptional()
  permissionIds: string[];
}
