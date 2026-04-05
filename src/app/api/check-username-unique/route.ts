import dbConnect from "@/src/lib/dbconnect";
import UserModel from "@/src/modal/user.modal";
import {success, z} from "zod/v4"
import { usernameValidation } from "@/src/schemas/signUpSchema";
import { messageSchema } from "@/src/schemas/messageSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET (request: Request) {
    // console.log(request.method)
    await dbConnect()
    //localhost:3000//api/cuu?username=hitesh?phone=android
    console.log(request.url)
    try {
        const {searchParams} = new URL (request.url)

        const queryParams = {
            username: searchParams.get('username')
        } 

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams)
        console.log(result) // do check what is this 

        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ')
                : "invalid query parameters"
            }, {status: 400})
        }

        const {username} = result.data
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

        if(existingVerifiedUser) {
            return Response.json(
                {
                success: false,
                message: "username is already taken"
                },
                {status: 400}
            )
        }
        return Response.json({
            success: true,
            message:'Username is unique'
        },
        {status: 500}
    )


    }catch (error) {
        console.error("Error checking in username", error)
        return  Response.json(
            {
                success: false,
                message: "Error checking the username"
            },
            {status: 400}
        )
    }
}