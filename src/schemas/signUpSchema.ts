import { email, z } from "zod/v4"


export const usernameValidation = z
    .string()
    .min(2,"Username must be atleast 2 character")
    .max(20,"User name must be no more than 20 character")
    .regex(/^[a-z0-9._]+$/i, "Username only contain '_' and '.' ")



export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6,{ message: "atleast 6 character"}).max(20)
})