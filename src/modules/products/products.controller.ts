import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async create(
    @Body() data,
    @Req() request
  ) {
    return await this.productsService.create({
      data,
      user: request.user
    })
  }
}
