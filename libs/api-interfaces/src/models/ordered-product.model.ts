import { ProductModel } from './product.model';

export interface OrderedProductModel extends Pick<ProductModel, 'id' | 'name' | 'price'> {
  count: number;
  image: string | undefined;
}
