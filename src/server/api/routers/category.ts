import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { ApiResponse } from "../utils/apiResponse";

export const categoryRouter = createTRPCRouter({
  fetchAllCategories: privateProcedure()
    .query( async ({ ctx }) => {
      const categories = await ctx.db.category.findMany()
      return new ApiResponse({
        data: categories,
        message: "Categories fetched successfully",
        statusCode: 200
      })
    })
});
