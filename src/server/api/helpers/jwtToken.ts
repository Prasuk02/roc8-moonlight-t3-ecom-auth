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
        expiresIn: '3d',
      },
    );

    return jwtToken;
  }
  catch (error) {
    throw new TRPCError({ message: error.message || "Not able to generate JWT token", code: 'INTERNAL_SERVER_ERROR' })
  }
};

export const verifyJwtToken = async (token: string) => {
  try {
    if (!token) {
      throw new TRPCError({ message: "Token not found", code: "BAD_REQUEST" })
    }
    const verifiedTokenData = jwt.verify(token, env.JWT_SECRET);
    return {
      data: verifiedTokenData as {
        userId: string,
        iat: number,
        exp: number
      },
      message: 'Valid token',
      success: true
    }
  } catch (error: unknown) {
    return {
      error,
      message: "Invalid Token",
      success: false
    }
  }
}
