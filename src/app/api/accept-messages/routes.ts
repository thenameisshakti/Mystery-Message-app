import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/src/lib/dbconnect";
import UserModel from "@/src/modal/user.modal";
import {User } from 'next-auth'
import { success } from "zod/v4";

 export async function POST (request: Request){
    await dbConnect() 

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if(!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id 
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new: true}
        )

        if(!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update the user messaging accepthing status"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User message acceptace status has been changed successfully"
            },
            {
                status: 400  
            }
        )
    } catch (error) {
         console.log("failed to update user status to accept messages")
         return Response.json(
            {
                success: false,
                message: "failed to update user staus to accept message"
            },
            {
                status: 500
            }
         )
         
    }


 }

 export async function GET(request: Request){
    await dbConnect() 

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if(!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id  
    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            },
        {
            status: 401
        })
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            {
                status: 400
            }
        )
    } catch (error) {
        console.log("failed to update user status to accept message")
        return Response.json(
            {
                success: false,
                message: "Error in getting messages acceptance status "
            },
            {
                status: 500
            }
        )
    }
 }
