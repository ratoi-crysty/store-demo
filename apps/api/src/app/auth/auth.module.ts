import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { defaultAccessTokenDuration, defaultAuthStrategy } from './constants/auth.constants';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: defaultAuthStrategy }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: defaultAccessTokenDuration,
      },
    }),
    UserModule,
  ],
  providers: [
    JwtStrategy,
    AuthService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {
}
