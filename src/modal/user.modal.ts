import mongoose from "mongoose";
import { Schema,Document } from "mongoose";

export interface Message extends Document{
    content : string
    createdAt: Date
}
export interface User extends Document{
    username: string,
    password: string,
    email: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[]
}

const MessageSchema: Schema<Message> = new Schema ({
    content:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}) 

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "userName is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "please use a valid email address"]
    },
    password: {
        type: String,
        required: [true,"password is required"]
    },
    verifyCode:{
        type: String,
        required: [true, "please provide the verify code to move forward"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "insert the veryfy code Expiry"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage : {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema) // if database already exist vs new creatrin
export default UserModel