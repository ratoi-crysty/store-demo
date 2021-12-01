import { ProductEntity } from '../../product/entity/product.entity';

export type OrderedProductModel = Pick<ProductEntity, 'id' | 'name' | 'description' | 'oldPrice' | 'price' | 'images'> & {
  count: number;
};
