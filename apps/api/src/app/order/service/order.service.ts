import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entity/order.entity';
import { Connection, In, Repository } from 'typeorm';
import { ProductService } from '../../product/service/product.service';
import { OrderedProductModel } from '../models/ordered-product.model';
import { catchError, concatMap, from, Observable, switchMap, throwError } from 'rxjs';
import { ProductEntity } from '../../product/entity/product.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(OrderEntity) protected repo: Repository<OrderEntity>,
              protected productService: ProductService,
              protected connection: Connection) {
  }

  buyProducts(products: OrderedProductModel[]): Observable<void> {
    const queryRunner = this.connection.createQueryRunner();

    return from(queryRunner.connect())
      .pipe(
        concatMap((): Observable<ProductEntity[]> => {
          return from(
            this.productService.repo.find({
              where: {
                id: In(products.map((product: OrderedProductModel) => product.id)),
              },
              lock: {
                mode: 'pessimistic_write',
              },
            }),
          );
        }),
        concatMap((entities: ProductEntity[]): Observable<unknown> => {
          const entitiesMap = new Map(entities.map((entity: ProductEntity) => [entity.id, entity]));

          products.forEach((product: OrderedProductModel) => {
            const entity: ProductEntity | undefined = entitiesMap.get(product.id);

            if (!entity) {
              throw new BadRequestException(`Product ${product.id} was not found!`);
            }

            entity.stock -= product.count;

            if (entity.stock < 0) {
              throw new BadRequestException(`Product ${product.id} count exceeds stock!`);
            }
          });

          return from(this.productService.repo.save(entities));
        }),
        switchMap(() => from(queryRunner.commitTransaction())),
        catchError((err: Error) => {
          return from(queryRunner.rollbackTransaction())
            .pipe(
              concatMap(() => throwError(() => new InternalServerErrorException(err))),
            );
        }),
      );
  }
}
