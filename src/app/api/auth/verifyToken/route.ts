import { NextResponse, type NextRequest } from "next/server";
import { verifyJwtToken } from "~/server/api/helpers/jwtToken";

/**
 * Handles POST request to verify JWT token.
 *
 * @param request - The incoming NextRequest object.
 * @returns The response with verification result.
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    const { message, data, success } = await verifyJwtToken(token);
    return NextResponse.json({ message, tokenData: data, success });
  } catch (error) {
    // Type assertion to safely handle the error
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message, success: false },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        { message: "An unknown error occurred", success: false },
        { status: 400 },
      );
    }
  }
}
