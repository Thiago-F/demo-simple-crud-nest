import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../modules/prisma/prisma.service";
import { CategoryEntity } from "src/data/entities/category.entity";

@Injectable()
export class CategoriesRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create({
        name,
        createdBy
    }): Promise<CategoryEntity> {
        return await this.prisma.category.create({
            data: {
                name,
                createdBy,
                updatedBy: createdBy
            }
        })
    }

    async findAll(args): Promise<CategoryEntity[]> {
        return await this.prisma.category.findMany({
            where: {
                name: {
                    contains: ''
                }
            }
        })
    }

    async findOne(args): Promise<CategoryEntity> {
        return await this.prisma.category.findFirst(args)
    }
}