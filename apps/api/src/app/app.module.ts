import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entity/user.entity';
import { join } from 'path';

console.log(join(__dirname, '../../../../data/store.db'));

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      synchronize: true,
      database: join(__dirname, '../../../data/store.db'),
      entities: [UserEntity],
    }),
    UserModule,
    AuthModule,
    CoreModule],
})
export class AppModule {}
