import { Expose } from 'class-transformer';

export class UserSerializes {
  @Expose()
  username: string;
}
