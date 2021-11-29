import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadModel } from '../models/jwt-payload.model';
import { UserService } from '../../user/service/user.service';
import { UserEntity, UserEntityRole } from '../../user/entity/user.entity';
import { pbkdf2 } from 'crypto';
import { from, Observable, Subscriber, switchMap } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(protected jwtService: JwtService,
              protected userService: UserService) {
  }

  register(
    email: string,
    name: string,
    password: string,
    role: UserEntityRole = UserEntityRole.User,
  ): Observable<UserEntity> {
    const salt: string = this.generateSalt();

    return this.getHash(password, salt)
      .pipe(
        switchMap((hash: string): Observable<UserEntity> => {
          const user: UserEntity = this.userService.repo.create({
            email,
            name,
            salt,
            password: hash.toString(),
            role,
          });

          return from(this.userService.repo.save(user));
        }),
      )
  }

  getUserPayload(user: UserEntity): JwtPayloadModel {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  validateUser(payload: JwtPayloadModel): Observable<UserEntity | undefined> {
    return from(this.userService.repo.findOne(payload.id));
  }

  getHash(password: string, salt: string): Observable<string> {
    return new Observable<string>((subscriber: Subscriber<string>) => {
      pbkdf2(
        password,
        salt,
        1000,
        64,
        'sha512',
        (err: Error | null, derivedKey: Buffer) => {
          if (err) {
            subscriber.error(err);
          } else {
            subscriber.next(derivedKey.toString('hex'));
          }
          subscriber.complete();
        },
      );
    });
  }

  signIn(payload: JwtPayloadModel): string {
    return this.jwtService.sign(payload);
  }

  protected generateSalt(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
