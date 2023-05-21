import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from 'src/data/repositories/category-repository';
import { ProductRepository } from 'src/data/repositories/product-repository';

@Injectable()
export class ProductsService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoriesRepository: CategoriesRepository
    ) { }

    async create({ data, user }) {

        const { name, valueInCents, categoryId } = data

        // check if category is valid
        const category = await this.categoriesRepository.findOne({
            where: {
                id: categoryId,
                deletedAt: null
            }
        })

        if (!category) {
            throw new NotFoundException('Category was not found')
        }

        return await this.productRepository.create({
            name,
            valueInCents,
            categoryId,
            createdBy: user.id
        })
    }
}
