import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';
import { UserEntity, UserEntityRole } from '../../user/entity/user.entity';
import { pbkdf2 } from 'crypto';
import { from, map, Observable, Subscriber, switchMap } from 'rxjs';

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
      );
  }

  updatePassword(id: number, password: string): Observable<void> {
    const salt: string = this.generateSalt();

    return this.getHash(password, salt)
      .pipe(
        switchMap((hash: string) => this.userService.repo.update({ id }, { password: hash })),
        map(() => undefined),
      );
  }

  validateUser(user: UserEntity, password: string): Observable<boolean> {
    return this.getHash(password, user.salt)
      .pipe(
        map((hash: string): boolean => hash === user.password),
      );
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

  signIn(user: UserEntity): string {
    return this.jwtService.sign(user.getPublicData());
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
