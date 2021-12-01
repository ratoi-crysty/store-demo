import { AppRequest } from '../types/app-request';
import { UserEntity } from '../../user/entity/user.entity';
import { UnauthorizedException } from '@nestjs/common';

export function getSessionUser(req: AppRequest): UserEntity {
  if (!req.user) {
    throw new UnauthorizedException();
  }

  return req.user;
}
