import { PickType } from '@nestjs/mapped-types';
import { UserModelDto } from './user-serialize.dto';
import { IsString } from 'class-validator';

export class CreateUserDto extends PickType(UserModelDto, ['username']) {
  @IsString()
  password: string;
}
