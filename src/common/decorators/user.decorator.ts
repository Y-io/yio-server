import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModelDto } from '../../domain/user/dto/user-serialize.dto';

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: UserModelDto = request.user;

  return data ? user?.[data] : user;
});
