import dbConnect from "@/src/lib/dbconnect";
import UserModel from "@/src/modal/user.modal";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";


export async function POST(request: Request) {
  await dbConnect();

  try {
    console.log("some things is happening")
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsernmae = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsernmae) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
        if (existingUserByEmail.isVerified){
            return Response.json({
            success: false,
            message: "User name already exist with this email"
        },{status: 400})
        }else{
          const hassedPassword = await bcrypt.hash(password,10)
          existingUserByEmail.password = hassedPassword
          existingUserByEmail.verifyCode = verifyCode
          existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
          await existingUserByEmail.save()
        }
    } else {
      const hassedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = await new UserModel({
        username,
        email,
        password: hassedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save()
    }

    //send verification email
    const emailResponse = await sendVerificationEmail (
        email,
        username,
        verifyCode
    )
    // check this docs for understand this below the code 
    if(!emailResponse.success){
        return Response.json({
            success: false,
            message: emailResponse.message
        },{status: 500})
    }
    return Response.json({
            success: true,
            message: "User Register Successfully . Please verify your email"
        },{status: 201})

  } catch (error) {
    console.error("Error repestering user");
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      },
    );
  }
}
