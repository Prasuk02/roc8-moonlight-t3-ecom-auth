import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { encryptPassword } from "../utils/encryption";
import { cookies } from "next/headers";
import { ApiResponse } from "../utils/apiResponse";

export const userRouter = createTRPCRouter({
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

});
