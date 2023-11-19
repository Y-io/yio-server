import { PickType } from '@nestjs/mapped-types';
import { CreateRoleDto } from '@/domain/role/dto/create-role.dto';
import { IsString } from 'class-validator';

export class SetPermissionsDto extends PickType(CreateRoleDto, ['permissionIds']) {
  @IsString()
  id: string;
}
