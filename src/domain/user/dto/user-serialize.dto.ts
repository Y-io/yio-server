import { Expose } from 'class-transformer';

export class UserSerializeDto {
  @Expose()
  username: string;
}
