import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UserDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
