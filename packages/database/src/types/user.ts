import { Prisma } from '../generated/prisma/client.js'

export type UserFull = Prisma.UserGetPayload<{ include: { auth: true } }>
export type AuthFull = Prisma.AuthGetPayload<{}>
export type BodyMetricFull = Prisma.BodyMetricGetPayload<{}>
