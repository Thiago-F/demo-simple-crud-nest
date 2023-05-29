import { Product } from "@prisma/client";

export class ProductEntity implements Product {
    id: number;
    name: string;
    valueInCents: number;
    categoryId: number;
    createdAt: Date;
    createdBy: number;
    updatedAt: Date;
    updatedBy: number;
    deletedAt: Date;
    deletedBy: number;
}
