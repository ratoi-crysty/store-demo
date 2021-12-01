import {
  BadRequestException,
  Body,
  Controller,
  Delete, ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginCredentialsDto } from '../dto/login-credentials.dto';
import { UserModel } from '../../user/model/user.model';
import { RegisterDetailsDto } from '../dto/register-details.dto';
import { UserEntity, UserEntityRole } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import { combineLatest, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { AdminGuard } from '../guards/admin.guard';
import { PatchRoleDto } from '../dto/patch-role.dto';
import { PatchPasswordDto } from '../dto/patch-password.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AppRequest } from '../types/app-request';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {

  constructor(protected authService: AuthService, protected userService: UserService) {
  }

  @Get()
  index(@Req() req: AppRequest): Observable<UserModel> {
    return this.getSessionUser(req);
  }

  @JwtAuthGuard.Disable()
  @Post('login')
  login(@Body() credentials: LoginCredentialsDto): Observable<{ token: string }> {
    return from(this.userService.repo.findOne({ email: credentials.email }))
      .pipe(
        switchMap((user: UserEntity | undefined): Observable<[boolean, UserEntity]> => {
          return user
            ? combineLatest([this.authService.validateUser(user, credentials.password), of(user)])
            : throwError(() => new UnauthorizedException());
        }),
        switchMap(([status, user]): Observable<{ token: string }> => {
          return status
            ? of({
              token: this.authService.signIn(user),
            })
            : throwError(() => new UnauthorizedException());
        }),
      );
  }

  @JwtAuthGuard.Disable()
  @Post('register')
  register(@Body() details: RegisterDetailsDto): Observable<{ token: string }> {
    return from(this.userService.repo.findOne({ email: details.email }))
      .pipe(
        switchMap((user: UserEntity | undefined) => {
          return user
            ? throwError(() => new BadRequestException('Email already exists!'))
            : this.userService.countByRole(UserEntityRole.Admin);
        }),
        switchMap((count: number) => {
          return this.authService.register(
            details.email,
            details.name,
            details.password,
            count ? UserEntityRole.User : UserEntityRole.Admin,
          );
        }),
        map((user: UserEntity): { token: string } => ({
          token: this.authService.signIn(user),
        })),
      );
  }


  @Patch('role/:id')
  @UseGuards(AdminGuard)
  patchUserRole(@Param('id') id: string, @Body() { role }: PatchRoleDto): Observable<void> {
    return this.getUser(+id)
      .pipe(
        switchMap(() => this.userService.repo.update({ id: +id }, { role })),
        map(() => undefined),
      );
  }

  @Patch('password/:id')
  @UseGuards(AdminGuard)
  patchUserPassword(@Param('id') id: string, @Body() { password }: PatchPasswordDto): Observable<void> {
    return this.getUser(+id)
      .pipe(
        switchMap(() => this.authService.updatePassword(+id, password)),
        map(() => undefined),
      );
  }

  @Delete(':id')
  deleteUser(@Req() req: AppRequest, @Param('id') id: string): Observable<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.getSessionUser(req)
      .pipe(
        switchMap((user: UserEntity) => {
          if (user.id !== +id && user.role !== UserEntityRole.Admin) {
            return throwError(() => new ForbiddenException());
          }

          return from(this.userService.repo.delete({ id: +id }));
        }),
        map(() => undefined),
      );
  }

  protected getUser(id: number): Observable<UserEntity> {
    return from(this.userService.repo.findOne({ id }))
      .pipe(
        switchMap((user: UserEntity | undefined) => {
          return user
            ? of(user)
            : throwError(() => new NotFoundException());
        }),
      );
  }

  protected getSessionUser(req: AppRequest): Observable<UserEntity> {
    return req.user
      ? req.user
      : throwError(() => new UnauthorizedException());
  }

  protected validateSession(req: AppRequest, password: string): Observable<boolean> {
    if (!req.user) {
      return of(false);
    }

    return req.user
      .pipe(
        switchMap((user: UserEntity): Observable<boolean> => {
          return this.authService.validateUser(user, password);
        }),
      );
  }
}
