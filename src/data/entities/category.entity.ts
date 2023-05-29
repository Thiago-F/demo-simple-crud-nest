import { Category } from "@prisma/client";

export class CategoryEntity implements Category {
    id: number;
    name: string;
    createdAt: Date;
    createdBy: number;
    updatedAt: Date;
    updatedBy: number;
    deletedAt: Date;
    deletedBy: number;
}
