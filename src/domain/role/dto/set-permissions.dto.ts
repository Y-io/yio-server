import { PickType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class SetPermissionsDto extends PickType(CreateRoleDto, ['permissionIds']) {
  @IsString()
  id: string;
}
