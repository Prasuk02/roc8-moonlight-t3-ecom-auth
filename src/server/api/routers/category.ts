import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { ApiResponse } from "../utils/apiResponse";

export const categoryRouter = createTRPCRouter({
  /**
   * @access Valid user token
   * @description Endpoint to fetch all the categories and
   *              Fetch current user interested categories
   */
  fetchAllCategories: privateProcedure()
    .query( async ({ ctx }) => {
      const { userId } = ctx;
      const allCategories = await ctx.db.category.findMany()
      const user = await ctx.db.user.findFirst({
        where: {
          id: userId
        }
      })

      const userInterestedCategories = await ctx.db.interestedCategory.findUnique({
        where: {
          userId: user?.id
        },
        select: {
          categoryIds: true
        }
      })

      return new ApiResponse({
        data: {
          allCategories,
          userInterestedCategories
        },
        message: "Categories fetched successfully",
        statusCode: 200
      })
    }),
});
