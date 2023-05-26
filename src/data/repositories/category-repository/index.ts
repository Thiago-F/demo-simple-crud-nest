import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../modules/prisma/prisma.service";

@Injectable()
export class CategoriesRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create({
        name,
        createdBy
    }) {
        return await this.prisma.category.create({
            data: {
                name,
                createdBy,
                updatedBy: createdBy
            }
        })
    }

    async findAll(args) {
        return await this.prisma.category.findMany({
            where: {
                name: {
                    contains: ''
                }
            }
        })
    }

    async findOne(args) {
        return await this.prisma.category.findFirst(args)
    }
}