import { faker } from '@faker-js/faker'
import { UserEntity } from "../../src/data/entities/user.entity";

export const makeFakeUser = (): Omit<UserEntity, 'password'> => ({
    id: faker.number.int(),
    name: faker.person.fullName(),
    email: faker.internet.email()
})