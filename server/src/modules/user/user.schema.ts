import {z} from 'zod'

export const updateUserSchema = z.object({
    name: z.string().min(3,{message:"Name must have at least 3 characters"}).optional()
})

export const getMeSchema = z.object({
    id: z.string(),
    email: z.email(),
})

export type UpdateUserDTO = z.infer<typeof updateUserSchema>
export type GetMeDTO = z.infer<typeof getMeSchema>