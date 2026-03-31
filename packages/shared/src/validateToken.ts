import jwt from 'jsonwebtoken'
import { z } from 'zod'

const tokenPayloadSchema = z.object({
    sub: z.uuid(),
})

export const validateToken = (token: string, secret: string) => {
    const decoded = jwt.verify(token, secret)

    return tokenPayloadSchema.safeParse(decoded)
}