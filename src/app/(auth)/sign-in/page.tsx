"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/src/schemas/signInSchema";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";

const page = () => {
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials',{
        redirect: false,
        identifier: data.identifier,
        password: data.password
    })
    console.log(result)
     if(result?.error) {
        if(result.error === "CredentialsSignIn"){
             toast.error("incorrect username or password")
        }else{
            toast.error("somethings is wrong , please try after some time")
            toast.error(result.error)
        }   
       
     }
     if(result?.url){
        router.replace('/dashboard')
        
     }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 ">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join True Feedback
        </h1>
        <p className="mb-4">Sign In to start your anonymous adventure</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            
            <Controller
            name="identifier"
            control={form.control}
            render={({field,fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email/Username</FieldLabel>
                  <Input type="email"
                  {...field}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
            )}
            />

            {/* PASSWORD */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>

                  <Input type="password" {...field} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* SUBMIT BUTTON */}
          <Button type="submit" className="w-full" >
           Sign In
          </Button>
        </form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
