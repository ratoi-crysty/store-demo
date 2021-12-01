import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { AuthGuard as BaseAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { CustomDecorator } from '@nestjs/common/decorators/core/set-metadata.decorator';
import { defaultAuthStrategy } from '../constants/auth.constants';

@Injectable()
export class JwtAuthGuard extends BaseAuthGuard(defaultAuthStrategy) {
  protected static disableMetaKey = 'AuthGuard:Disable';

  static Disable(): CustomDecorator<string> {
    return SetMetadata(this.disableMetaKey, true);
  }

  constructor(protected reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const noAuth: boolean = this.reflector.get<boolean>(JwtAuthGuard.disableMetaKey, context.getHandler());

    if (noAuth) {
      return true;
    }

    return super.canActivate(context);
  }
}
