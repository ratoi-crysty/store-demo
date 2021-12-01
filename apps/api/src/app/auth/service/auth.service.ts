import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';
import { UserEntity, UserEntityRole } from '../../user/entity/user.entity';
import { pbkdf2 } from 'crypto';

@Injectable()
export class AuthService {
  constructor(protected jwtService: JwtService,
              protected userService: UserService) {
  }

  async register(
    email: string,
    name: string,
    password: string,
    role: UserEntityRole = UserEntityRole.User,
  ): Promise<UserEntity> {
    const salt: string = this.generateSalt();
    const hash: string = await this.getHash(password, salt)
    const user: UserEntity = this.userService.repo.create({
      email,
      name,
      salt,
      password: hash.toString(),
      role,
    });

    return this.userService.repo.save(user);
  }

  async updatePassword(id: number, password: string): Promise<void> {
    const salt: string = this.generateSalt();

    const hash: string = await this.getHash(password, salt);
    await this.userService.repo.update({ id }, { password: hash });
  }

  async validateUser(user: UserEntity, password: string): Promise<boolean> {
    const hash: string = await this.getHash(password, user.salt);

    return hash === user.password;
  }

  async getHash(password: string, salt: string): Promise<string> {
    return new Promise<string>((resolve: (value: string) => void, reject: (err: Error) => void) => {
      pbkdf2(
        password,
        salt,
        1000,
        64,
        'sha512',
        (err: Error | null, derivedKey: Buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(derivedKey.toString('hex'));
          }
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
