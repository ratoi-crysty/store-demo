import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { CrudActions, getAction } from '@nestjsx/crud';
import { UserEntity, UserEntityRole } from '../../user/entity/user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class ProductAclGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const action: CrudActions = getAction(context.getHandler());

    if ([CrudActions.ReadAll, CrudActions.ReadOne].includes(action)) {
      return true;
    }

    const status: boolean = await this.canActivateAsync(context);

    if (!status) {
      throw new ForbiddenException('Forbidden resource');
    }

    return context
      .switchToHttp()
      .getRequest<Request & { user: UserEntity }>()
      .user
      .role === UserEntityRole.Admin;
  }

  protected async canActivateAsync(context: ExecutionContext): Promise<boolean> {
    const canActivate: boolean | Promise<boolean> | Observable<boolean> = super.canActivate(context);

    return canActivate instanceof Observable
      ? lastValueFrom(canActivate)
      : canActivate;
  }
}
