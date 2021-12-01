import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ProductEntity } from '../entity/product.entity';
import { ProductService } from '../service/product.service';
import { ProductAclGuard } from '../guards/product-acl.guard';

@Controller('product')
@Crud({
  model: {
    type: ProductEntity,
  },
})
@UseGuards(ProductAclGuard)
export class ProductController implements CrudController<ProductEntity> {
  constructor(public service: ProductService) {
  }
}
