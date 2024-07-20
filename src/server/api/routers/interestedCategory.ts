import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { ApiResponse } from "../utils/apiResponse";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const interestedCategoryRouter = createTRPCRouter({
  addUserInterestedCategories: privateProcedure()
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const user = await ctx.db.user.findFirst({
        where: {
          id: userId
        }
      })

      if (!user) {
        throw new TRPCError({ message: "User not found, Invalid token", code: "FORBIDDEN" });
      }

      const userInterestedCategories = await ctx.db.interestedCategory.upsert({
        where: {
          userId: user.id
        },
        update: {
          categoryIds: {
            push: input.id
          }
        },
        create: {
          categoryIds: {
            set: [ input.id ]
          },
          userId: user.id
        }
      })

      if (!userInterestedCategories) {
        throw new TRPCError({ message: "Something went wrong, Unable to add new category", code: "INTERNAL_SERVER_ERROR" });
      }

      return new ApiResponse({
        data: userInterestedCategories,
        message: "Category added successfully",
        statusCode: 200
      })
    }),

  removeUserInterestedCategories: privateProcedure()
    .input(
      z.object({
        ids: z.array(z.string())
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const userInterestedCategories = await ctx.db.interestedCategory.update({
        where: {
          userId: userId
        },
        data: {
          categoryIds: {
            set: input.ids
          }
        }
      })

      if (!userInterestedCategories) {
        throw new TRPCError({ message: "Something went wrong, Unable to remove category", code: "INTERNAL_SERVER_ERROR" });
      }

      return new ApiResponse({
        data: userInterestedCategories,
        message: "Category removed successfully",
        statusCode: 200
      })
    })
});
