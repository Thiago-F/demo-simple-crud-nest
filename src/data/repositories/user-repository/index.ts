import { Injectable } from "@nestjs/common";


const users = []

@Injectable()
export class UserRepository {
    async create(data) {
        users.push(data)

        return data
    }

    async findAll(args: any) {
        return users
    }
}