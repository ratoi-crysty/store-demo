import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { UserEntity } from '../../user/entity/user.entity';
import { UserRole } from '@store-demo/api-interfaces';
import { CustomDecorator } from '@nestjs/common/decorators/core/set-metadata.decorator';
import { Reflector } from '@nestjs/core';
import { AppRequest } from '../types/app-request';

@Injectable()
export class AdminGuard implements CanActivate {
  protected static disableMetaKey = 'AdminGuard:Disable';

  constructor(protected reflector: Reflector) {
  }

  static Disable(): CustomDecorator<string> {
    return SetMetadata(this.disableMetaKey, true);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const noAuth: boolean = this.reflector.get<boolean>(AdminGuard.disableMetaKey, context.getHandler());
    const request: AppRequest = context.switchToHttp().getRequest();

    if (noAuth) {
      return true;
    }

    const user: UserEntity | undefined = request.user;

    return user?.role === UserRole.Admin;
  }
}
