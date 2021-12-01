import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadModel } from '../models/jwt-payload.model';
import { UserEntity } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected useService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayloadModel): Promise<UserEntity> {
    const user: UserEntity | undefined = await this.useService.repo.findOne({ id: payload.id });

    console.log(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
