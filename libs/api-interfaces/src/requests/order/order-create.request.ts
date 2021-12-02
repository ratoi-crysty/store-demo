import { OrderedProductModel } from '../../models/ordered-product.model';

export interface OrderCreateRequest {
  products: Array<Omit<OrderedProductModel, 'image'>>;
}
