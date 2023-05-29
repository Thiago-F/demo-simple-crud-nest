import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../modules/prisma/prisma.service";
import { ProductEntity } from "src/data/entities/product.entity";

@Injectable()
export class ProductRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create({
        name,
        valueInCents,
        categoryId,
        createdBy
    }): Promise<ProductEntity> {
        return await this.prisma.product.create({
            data: {
                name,
                valueInCents,
                categoryId,
                createdBy,
                updatedBy: createdBy
            }
        })
    }

    async findAll(args): Promise<ProductEntity[]> {
        return await this.prisma.product.findMany(args)
    }

    async findOne(args): Promise<ProductEntity> {
        return await this.prisma.product.findFirst(args)
    }
}