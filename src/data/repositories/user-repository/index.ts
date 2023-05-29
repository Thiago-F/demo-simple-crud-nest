import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../modules/prisma/prisma.service";
import { UserEntity } from "src/data/entities/user.entity";

@Injectable()
export class UserRepository {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    removePasswordField(user: UserEntity): Omit<UserEntity, 'password'> {
        const { password, ...restOfUser } = user
        return restOfUser
    }

    async create(data): Promise<Omit<UserEntity, 'password'>> {
        const createdUser = await this.prisma.user.create({
            data
        })

        return this.removePasswordField(createdUser)
    }

    async findOne(args: any): Promise<Omit<UserEntity, 'password'>> {
        const user = await this.prisma.user.findUnique(args)
        return this.removePasswordField(user)
    }

    async findOneWithPassword(args: any): Promise<UserEntity> {
        return await this.prisma.user.findUnique(args)
    }

    async findAll(args: any): Promise<Omit<UserEntity, 'password'>[]> {
        const users = await this.prisma.user.findMany(args)
        return users.map(user => this.removePasswordField(user))
    }
}