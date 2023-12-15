import { PickType } from '@nestjs/mapped-types';
import { UserModelDto } from './user-serialize.dto';

export class UpdateUserDto extends PickType(UserModelDto, []) {}
