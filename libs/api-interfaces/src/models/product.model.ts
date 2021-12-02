export interface ProductModel {
  id: number;
  name: string;
  description: string;
  oldPrice: number;
  price: number;
  ratingValue: number;
  ratingCounter: number;
  stock: number;
  images: string[];
  createdAt: Date;
  updateAt: Date;
  deleteAt: Date;
}
