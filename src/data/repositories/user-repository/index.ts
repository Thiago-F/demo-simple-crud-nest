import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";


const users = []

@Injectable()
export class UserRepository {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(data) {
        const createdUser = await this.prisma.user.create({
            data
        })

        const { password, ...user } = createdUser

        return user
    }

    async findOne(args: any) {
        return this.prisma.user.findUnique(args)
    }

    async findAll(args: any) {
        return users
    }
}