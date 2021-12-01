import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { CrudActions, getAction } from '@nestjsx/crud';
import { UserEntity, UserEntityRole } from '../../user/entity/user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Injectable()
export class ProductAclGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const action: CrudActions = getAction(context.getHandler());

    if ([CrudActions.ReadAll, CrudActions.ReadOne].includes(action)) {
      return true;
    }

    return this.canActivateAsync(context)
      .pipe(
        switchMap((status: boolean): Observable<UserEntity> => {
          if (!status) {
            return throwError(() => new ForbiddenException('Forbidden resource'));
          }

          return context
            .switchToHttp()
            .getRequest<Request & { user: Observable<UserEntity> }>()
            .user;
        }),
        map((user: UserEntity): boolean => {
          return user.role === UserEntityRole.Admin;
        }),
      );
  }

  protected canActivateAsync(context: ExecutionContext): Observable<boolean> {
    const canActivate: boolean | Promise<boolean> | Observable<boolean> = super.canActivate(context);

    return typeof canActivate === 'boolean'
      ? of(canActivate)
      : from(canActivate);
  }
}
