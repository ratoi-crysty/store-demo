import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserEntity, UserEntityRole } from '../../user/entity/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: UserEntity = (request as any).user;

    return user.role === UserEntityRole.Admin;
  }
}
