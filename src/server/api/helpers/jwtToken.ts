import jwt from "jsonwebtoken";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";
import * as jose from 'jose'

const jwtConfig = {
  secret: new TextEncoder().encode(env.JWT_SECRET),
}

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
    const tokenData = await jose.jwtVerify(token, jwtConfig.secret)
    return {
      data: tokenData.payload,
      message: 'Valid token',
      success: true
    }
  } catch (error: unknown) {
    const jwtError = error as TRPCError;
    return {
      message: jwtError.message,
      success: false
    }
  }
}
