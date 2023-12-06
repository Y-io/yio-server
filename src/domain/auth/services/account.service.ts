import { Injectable } from '@nestjs/common';
import { UserService } from '@/domain/user/user.service';

@Injectable()
export class AccountService {
  constructor(private userService: UserService) {}
  async getProfile(userId: string) {
    return this.userService.findUserById(userId);
  }
}
