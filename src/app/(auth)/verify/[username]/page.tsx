"use client"; 

import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/src/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/src/schemas/verifySchema";
import * as z from "zod/v4";
import axios from "axios";
import { ApiResponse } from "@/src/types/ApiResponse";
import { AxiosError } from "axios";
import {  Controller } from "react-hook-form";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  // zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success(response.data.message);
      router.replace(`sign-in`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "An error occurred. Please try again.",
      );
    }
  };

  return (
     <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* USERNAME */}
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Verification Code</FieldLabel>
                  <Input type="code" {...field}
                  placeholder="enter your code"
                  />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Button 
            type="submit">Verify</Button>
          </FieldGroup>

        </form>
      </div>
    </div>
  )
}

export default VerifyAccount;
