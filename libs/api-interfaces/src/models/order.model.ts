import { UserModel } from './user.model';
import { OrderedProductModel } from './ordered-product.model';

export interface OrderModel {
  id: number;
  createdAt: Date;
  updateAt: Date;
  products: OrderedProductModel[];
  user?: UserModel;
}
