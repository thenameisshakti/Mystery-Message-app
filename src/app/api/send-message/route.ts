
import dbConnect from "@/src/lib/dbconnect";
import UserModel from "@/src/modal/user.modal";
import { Message } from "@/src/modal/user.modal";
import { success } from "zod/v4";

export async function POST(request: Request){
    await dbConnect()
    const {username, content} = await request.json()
    
    try {
        const user = await UserModel.findOne({username})
        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "Unable to find the user"
                },
                {
                    status: 404
                }
            )
        }
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: "User is not Accepting the messages"
                },
                {
                    status: 403
                }
            )
        }

        const newMessage = {content, createdAt:  new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message send successfully"
            },
            {
                status: 200
            }
        )


    } catch (error) {
        console.log("Error adding messages",error)
        return Response.json(
            {
                success: false,
                message: "internal server error"
            },
            {
                status: 500
            }
         )
    }
}