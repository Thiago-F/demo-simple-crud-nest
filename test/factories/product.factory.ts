import { faker } from '@faker-js/faker'
import { ProductEntity } from 'src/data/entities/product.entity';

export const makeFakeProduct = (): ProductEntity => ({
    id: faker.number.int(),
    name: faker.person.fullName(),
    valueInCents: faker.number.int({ min: 10000, max: 1000000 }),
    categoryId: faker.number.int(),
    createdAt: faker.date.past(),
    createdBy: faker.number.int(),
    updatedAt: faker.date.recent(),
    updatedBy: faker.number.int(),
    deletedAt: null,
    deletedBy: null
})