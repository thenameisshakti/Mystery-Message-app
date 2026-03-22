import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/src/lib/dbconnect";
import UserModel from "@/src/modal/user.modal";
import {User } from 'next-auth' 
import mongoose from "mongoose";
import { success } from "zod/v4";

export async function GET(request: Request) {
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

    const userId = new  mongoose.Types.ObjectId(user._id)
    
    //as we have conver the _id previously in string to we have to 
    // do console log of this
    try {
        const user = await UserModel.aggregate([
            {$match : {id: userId}},
            {$unwind: '$messages'},
            {$sort: {"messages.createdAt": -1}},
            {$group: {_id: "$_id", messages: {$push: '$messages'}}}
        ])

        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 401
                }
            )
        }

         return Response.json(
                {
                    success: true,
                    messages: user[0].messages // do check this
                },
                {
                    status: 200
                }
            )
    } catch (error) {
        console.log("an unexpected error occured", error)
         return Response.json(
            {
                success: false,
                message: "unexpected Error"
            },
            {
                status: 500
            }
         )
    }

}