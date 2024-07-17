import jwt from "jsonwebtoken";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";

export const generateJwtToken = (userId: string) => {
  try {
    const jwtToken = jwt.sign(
      {
        userId: userId,
      },
      env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: Date.now() + 3 * 24 * 60 * 60 * 100 * 1000,
      },
    );

    return jwtToken;
  }
  catch (error) {
    throw new TRPCError({ message: error.message || "Not able to generate JWT token", code: 'INTERNAL_SERVER_ERROR' })
  }
};
