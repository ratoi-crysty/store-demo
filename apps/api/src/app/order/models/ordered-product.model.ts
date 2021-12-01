import { ProductEntity } from '../../product/entity/product.entity';

export type OrderedProductModel = Pick<ProductEntity, 'id' | 'name' | 'price'> & {
  count: number;
  image: string | undefined;
};
