import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { ValidatePassword, ValidateVerificationCode, encryptPassword, encryptVerificationCode } from "../utils/encryption";
import { cookies } from "next/headers";
import { ApiResponse } from "../utils/apiResponse";
import { Resend } from "resend";
import { env } from "~/env";
import React from "react";
import VerifyEmailTemplate from "../email-templates/VerifyEmail";
import randomize from 'randomatic'
import { isVerificationCodeValid } from "../utils/validate";
import { generateJwtToken } from "../helpers/jwtToken";

export const userRouter = createTRPCRouter({
  // Endpoint to register new user
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z
          .string()
          .min(8)
          .regex(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
            "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, !, %, *, ?, &)."
          ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      if ( !name || !email || !password ) {
        throw new TRPCError({ message: "Please ensure all fields are filled out!", code: "BAD_REQUEST" });
      }

      const user = await ctx.db.user.findFirst({ where: { email } });

      if (user) {
        throw new TRPCError({ message: "Email Id already exists!", code: "BAD_REQUEST" });
      }

      const hashedPassword = encryptPassword(password);

      const newUser = await ctx.db.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      });
      
      cookies().set('uuid', newUser?.id);

      return new ApiResponse({
        data: newUser,
        message: "Signup successful! Welcome to moonshot ecommerce webapp.",
        statusCode: 200
      });
    }),

  // Endpoint to send verification code to user registered email
  sendVerificationCode: publicProcedure
    .mutation(async ({ ctx }) => {
      const userId = cookies().get('uuid')?.value;
      if (!userId) {
        throw new TRPCError({ message: "Unable to identify user. Please try to login / signup again.", code: "BAD_REQUEST" })
      }

      const user = await ctx.db.user.findFirst({ where: { id: userId } });
      if ( !user ) {
        throw new TRPCError({ message: "User Invalid. Please try to login / signup again.", code: "BAD_REQUEST" })
      }

      const verificationCode = await ctx.db.verificationCode.findFirst({ where: { userId } })
      const isCodeValid = verificationCode && isVerificationCodeValid(verificationCode);
      if (isCodeValid) {
        return new ApiResponse({
          data: null,
          message: "A verification code has already been sent to your registered email. Please check your inbox to proceed.",
          statusCode: 200
        })
      } 
      else if (verificationCode) {
        await ctx.db.verificationCode.delete({ 
          where: {
            id: verificationCode?.id,
            userId: verificationCode?.userId
          } 
        });
      }

      const newVerificationCode = randomize('0', 8);

      const resend = new Resend(env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: env.SENDER_EMAIL,
        to: ['prasukj02@gmail.com'],
        subject: 'Verification Code for moonshot Ecommerce Account',
        react: VerifyEmailTemplate({ name: "Prasuk Jain", code: newVerificationCode }) as React.ReactElement,
      })

      if (error) {
        throw new TRPCError({ message: error.message, code: "INTERNAL_SERVER_ERROR" })
      }

      await ctx.db.verificationCode.create({
        data: {
          code: encryptVerificationCode(newVerificationCode),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          userId
        }
      })

      return new ApiResponse({
        data: data,
        message: "A verification code has been successfully sent to your registered email address. Please check your inbox to proceed.",
        statusCode: 200
      })
    }),

  // Endpoint for email verification using the code sent to the user's registered email address
  verifyRegisteredEmail: publicProcedure
    .input(
      z.object({
        code: z
          .string()
          .length(8)
      })
    )
    .mutation( async ({ ctx, input }) => {
      const { code } = input;
      const userId = cookies().get('uuid')?.value;
      if (!userId) {
        throw new TRPCError({ message: "Unable to identify user. Please try to login / signup again.", code: "BAD_REQUEST" })
      }

      const user = await ctx.db.user.findFirst({ where: { id: userId } });
      if ( !user ) {
        throw new TRPCError({ message: "User Invalid. Please try to login / signup again.", code: "BAD_REQUEST" })
      }
      
      const verificationCode = await ctx.db.verificationCode.findFirst({ where: { userId } });
      if (!verificationCode || !code) {
        throw new TRPCError({ message: "Went something wrong! Please try after sometime", code: "INTERNAL_SERVER_ERROR" })
      }

      const isCodeValid = isVerificationCodeValid(verificationCode);
      const isEmailCodeValidated = ValidateVerificationCode(code, verificationCode.code);

      if (!isCodeValid || !isEmailCodeValidated) {
        throw new TRPCError({ message: "Invalid Code. Please refer your registered mail to proceed.", code: "BAD_REQUEST" });
      }

      await ctx.db.user.update({
        where: {
          id: userId
        },
        data: {
          isVerified: true
        }
      })

      const token = generateJwtToken(userId);
      cookies().set('token', token);

      return new ApiResponse({
        data: null,
        message: "Email verified successfully!",
        statusCode: 200
      })
    }),

  // Endpoint to login registered users and generate JWT token
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;

      if ( !email || !password ) {
        throw new TRPCError({ message: "Please ensure all fields are filled out!", code: "BAD_REQUEST" })
      }

      const user = await ctx.db.user.findFirst({ where: { email } })

      if (!user) {
        throw new TRPCError({ message: "Incorrect Email Id or Password", code: "BAD_REQUEST" })
      }

      if (!ValidatePassword(password, user.password)) {
        throw new TRPCError({ message: "Incorrect Email Id or Password", code: "BAD_REQUEST" })
      }

      cookies().set('uuid', user.id)

      if (user.isVerified) {
        const token = generateJwtToken(user.id);
        cookies().set('token', token);
      }

      return new ApiResponse({
        data: user,
        message: "Login successful! Welcome to moonshot ecommerce webapp.",
        statusCode: 200
      });
  }),

  getUser: privateProcedure()
    .query(async({ ctx }) => {
      const user = await ctx.db.user.findFirst({ where: { id: ctx.userId } });

      if (!user) {
        throw new TRPCError({ message: "User Not Authenticated", code: "BAD_REQUEST" })
      }

      return new ApiResponse({
        data:user,
        message: "User details fetched successfully",
        statusCode: 200
      });
  }),

  logout: privateProcedure()
    .mutation(async () => {
      const authToken = cookies().get("token");

      if (!authToken) {
        throw new TRPCError({
          message: "Invalid Request",
          code: "BAD_REQUEST",
        });
      }

      cookies().delete("token");
      cookies().delete("uuid");

      return;
  }),
});
