import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";

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
    }) {
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

    async findAll(args) {
        return await this.prisma.product.findMany(args)
    }

    async findOne(args) {
        return await this.prisma.product.findFirst(args)
    }
}