import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../service/auth.service';
import { JwtPayloadModel } from '../models/jwt-payload.model';
import { UserEntity } from '../../user/entity/user.entity';
import { Observable, of, switchMap, throwError } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: JwtPayloadModel): Observable<UserEntity> {
    return this.authService.validateUser(payload)
      .pipe(
        switchMap((user: UserEntity | undefined): Observable<UserEntity> => {
          return user
            ? of(user)
            : throwError(() => new UnauthorizedException());
        }),
      );
  }
}
