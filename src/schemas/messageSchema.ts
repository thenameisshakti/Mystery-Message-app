import {z} from "zod/v4"

export const messageSchema = z.object({
    content : z
    .string()
    .min(10, {message: "write at least 10 character"})
    .max(300, {message: "content must be no longer than 300 character"})
})