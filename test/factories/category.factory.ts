import { faker } from '@faker-js/faker'
import { CategoryEntity } from 'src/data/entities/category.entity';

export const makeFakeCategory = (): CategoryEntity => ({
    id: faker.number.int(),
    name: faker.person.fullName(),
    createdAt: faker.date.past(),
    createdBy: faker.number.int(),
    updatedAt: faker.date.recent(),
    updatedBy: faker.number.int(),
    deletedAt: null,
    deletedBy: null
})