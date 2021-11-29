import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginCredentialsDto } from '../dto/login-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserModel } from '../../user/model/user.model';
import { RegisterDetailsDto } from '../dto/register-details.dto';
import { UserEntity, UserEntityRole } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import { combineLatest, from, Observable, of, switchMap, throwError } from 'rxjs';

@Controller('auth')
export class AuthController {

  constructor(protected authService: AuthService, protected userService: UserService) {
  }

  @Post('login')
  login(@Body() credentials: LoginCredentialsDto): Observable<{ token: string }> {
    return from(this.userService.repo.findOne({ email: credentials.email }))
      .pipe(
        switchMap((user: UserEntity | undefined): Observable<[string, UserEntity]> => user
          ? combineLatest([
            this.authService.getHash(credentials.password, user.salt),
            of(user),
          ])
          : throwError(() => new UnauthorizedException())),
        switchMap(([hash, user]): Observable<{ token: string }> => hash === user.password
          ? of({
            token: this.authService.signIn(this.authService.getUserPayload(user)),
          })
          : throwError(() => new UnauthorizedException())),
      );
  }

  @Post('register')
  register(@Body() details: RegisterDetailsDto): Observable<UserEntity> {
    return from(this.userService.repo.findOne({ email: details.email }))
      .pipe(
        switchMap((user: UserEntity | undefined) => {
          return user
            ? throwError(() => new BadRequestException('Email already exists!'))
            : this.userService.countByRole(UserEntityRole.Admin);
        }),
        switchMap((count: number) => this.authService.register(
          details.email,
          details.name,
          details.password,
          count ? UserEntityRole.User : UserEntityRole.Admin,
        )),
      );
  }

  @Get()
  @UseGuards(AuthGuard())
  index(@Req() req: Request): UserModel {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (req as any).user;
  }
}
