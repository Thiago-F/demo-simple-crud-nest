import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductRepository } from '../../data/repositories/product-repository';
import { CategoriesRepository } from '../../data/repositories/category-repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    CategoriesRepository
  ]
})
export class ProductsModule {}
