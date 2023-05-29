import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from '../../data/repositories/category-repository';
import { ProductRepository } from '../../data/repositories/product-repository';

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

    async listAll({ filters, user }) {
        const { name, categoryId } = filters
        let whereConditions: any = {
            deletedAt: null,
        }

        if (name) {
            whereConditions = {
                ...whereConditions,
                name: {
                    in: name
                }
            }
        }

        if (categoryId) {
            whereConditions = {
                ...whereConditions,
                categoryId
            }
        }

        return await this.productRepository.findAll({
            where: whereConditions
        })
    }
}
