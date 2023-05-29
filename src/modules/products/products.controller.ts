import { Body, Controller, Get, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async create(
    @Body() data: CreateProductDto,
    @Req() request
  ) {
    return await this.productsService.create({
      data,
      user: request.user
    })
  }

  @Get()
  async list(
    @Query() query,
    @Request() request
  ) {
    const { name, categoryId } = query

    return await this.productsService.listAll({
      filters: {
        name,
        categoryId
      },
      user: request.user
    })
  }
}
