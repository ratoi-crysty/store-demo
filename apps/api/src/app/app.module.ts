import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoreModule } from './@core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entity/user.entity';
import { join } from 'path';
import { ProductModule } from './product/product.module';
import { AssetModule } from './asset/asset.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { dataFolder } from './@shared/shared.constants';
import { ProductEntity } from './product/entity/product.entity';
import { OrderModule } from './order/order.module';
import { OrderEntity } from './order/entity/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      synchronize: true,
      database: join(dataFolder, 'store.db'),
      entities: [UserEntity, ProductEntity, OrderEntity],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(dataFolder, 'assets'),
    }),
    UserModule,
    AuthModule,
    CoreModule,
    ProductModule,
    AssetModule,
    OrderModule],
})
export class AppModule {}
