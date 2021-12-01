import { UserEntity } from '../../user/entity/user.entity';
import { Request } from 'express';

export interface AppRequest extends Request {
  user?: UserEntity;
}
