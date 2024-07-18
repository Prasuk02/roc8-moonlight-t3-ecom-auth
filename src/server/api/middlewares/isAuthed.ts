import { TRPCError } from "@trpc/server";
import { t } from "../trpc";
import { verifyJwtToken } from "../helpers/jwtToken";

// Define the isAuthed middleware correctly
export const isAuthed = () => {
  return t.middleware(async (opts) => {
    const { token } = opts?.ctx?.authToken || {};

    if (!token) {
      throw new TRPCError({ message: "Token not found.", code: "FORBIDDEN" });
    }

    const { data: user, success: isTokenValid, message } = await verifyJwtToken(token);
    if (!isTokenValid) {
      throw new TRPCError({ message, code: "FORBIDDEN" });
    }

    return opts.next({ ...opts, ctx: { ...opts.ctx, userId: user?.userId } });
  });
}