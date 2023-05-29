import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserEntity } from '../../data/entities/user.entity';
import { CategoriesRepository } from '../../data/repositories/category-repository';

interface CreateDto {
  data: CreateCategoryDto,
  user: Omit<UserEntity, 'password'>
}
interface ListDto {
  filters: { name: string },
  user: Omit<UserEntity, 'password'>
}

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository
  ) { }

  async create({ data, user }: CreateDto) {
    const { name } = data

    const category = await this.categoriesRepository.findOne({
      where: {
        name,
        deletedAt: null
      }
    })

    if (category) {
      throw new UnauthorizedException('Category already exists')
    }

    return await this.categoriesRepository.create({
      name,
      createdBy: user.id
    })
  }

  async findAll({ filters, user }: ListDto) {

    const { name } = filters

    return await this.categoriesRepository.findAll({
      where: {
        name: {
          contains: name
        },
        deletedAt: null
      }
    })
  }

  async findOne({ id }: { id: number }) {
    return await this.categoriesRepository.findOne({
      where: {
        id,
        deletedAt: null
      }
    })
  }
}
