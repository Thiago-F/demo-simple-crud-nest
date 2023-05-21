import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() request
  ) {
    return this.categoriesService.create({
      data: createCategoryDto,
      user: request.user
    });
  }

  @Get()
  findAll(
    @Query() query,
    @Req() request
  ) {
    const { name } = query
    return this.categoriesService.findAll({
      filters: {
        name
      },
      user: request.user
    });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.categoriesService.findOne({
      id: Number(id)
    });
  }
}
