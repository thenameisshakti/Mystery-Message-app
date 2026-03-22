import dbConnect from "@/src/lib/dbconnect"
import UserModel from "@/src/modal/user.modal"
import {success, z} from "zod/v4"
import { usernameValidation } from "@/src/schemas/signUpSchema"

export async function POST (request: Request){
    await dbConnect()

    try{
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username: decodedUsername})
        if(!user) {
            return Response.json(
                {
                success: false,
                message:"user not found to verify the email"
            },
            {
                status: 500
            }
        )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = user.verifyCodeExpiry > new Date()
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "user verified"
                },
                {
                    status: 201
                }
            )
        }else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "your time sloat to verify the email is expoired , please try again after few minutes"
                },
                {
                    status: 400
                }
            )
        }else {
           return Response.json(
                {
                    success: false,
                    message: "OTP you entered is not correct "
                },
                {
                    status: 400
                }
            )
        }
    }catch (error) {
         console.error("Error while verify the email", error)
        return  Response.json(
            {
                success: false,
                message: "Error in verfy email"
            },
            {status: 400}
        )
    }
}