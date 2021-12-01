import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entity/order.entity';
import { Connection, In, Repository } from 'typeorm';
import { ProductService } from '../../product/service/product.service';
import { OrderedProductModel } from '../models/ordered-product.model';
import { ProductEntity } from '../../product/entity/product.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(OrderEntity) public repo: Repository<OrderEntity>,
              protected productService: ProductService,
              protected connection: Connection) {
  }

  async create(user: UserEntity, products: Array<Omit<OrderedProductModel, 'image'>>): Promise<OrderEntity> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction('READ UNCOMMITTED');

    try {
      const entities: ProductEntity[] = await this.productService.repo.find({
        where: {
          id: In(products.map((product: Omit<OrderedProductModel, 'image'>) => product.id)),
        },
        // lock: {
        //   mode: 'pessimistic_write',
        // },
      });

      const entitiesMap = new Map(entities.map((entity: ProductEntity) => [entity.id, entity]));

      const orderedProducts: OrderedProductModel[] = products.map((
        product: Omit<OrderedProductModel, 'image'>,
      ): OrderedProductModel => {
        const entity: ProductEntity | undefined = entitiesMap.get(product.id);

        if (!entity) {
          throw new BadRequestException(`Product ${product.id} was not found!`);
        }

        if (product.name !== entity.name || product.price !== entity.price) {
          throw new BadRequestException(`Product ${product.id} is out of date!`);
        }

        entity.stock -= product.count;

        if (entity.stock < 0) {
          throw new BadRequestException(`Product ${product.id} count exceeds stock!`);
        }

        return {
          ...product,
          image: entity.images[0],
        };
      });

      await this.productService.repo.save(entities);

      const order: OrderEntity = await this.repo.save(this.repo.create({
        user,
        products: orderedProducts,
      }));

      await queryRunner.commitTransaction();

      console.log('Return order', order);

      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err instanceof BadRequestException) {
        throw err;
      } else {
        throw new InternalServerErrorException(err);
      }
    }
  }
}
