import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserEntity, UserEntityRole } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class RegisterGuard implements CanActivate {
  constructor(protected userService: UserService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const users: UserEntity[] = await this.userService.repo.find();

    if (!users.length) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: UserEntity = (request as any).user;

    return user.role === UserEntityRole.Admin;
  }
}
