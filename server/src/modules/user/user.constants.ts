import { Prisma } from "@prisma/client"

export const defaultUserSelect = {
    id:true,
    name:true,
    email:true,
    createdAt:true,
    updatedAt:true,
} satisfies Prisma.UserSelect;