import { IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserDto {
  @IsOptional()
  @Expose()
  id: string;

  @Expose()
  @IsOptional()
  username: string;

  @Expose()
  @IsOptional()
  email: string;

  @Expose()
  roles: any;

  @Expose()
  organizations: any;
}
