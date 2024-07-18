import { NextResponse, type NextRequest } from "next/server";
import { verifyJwtToken } from "~/server/api/helpers/jwtToken";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // Token verification logic here
    const { message, data, success } = await verifyJwtToken(token);

    return NextResponse.json({ message, tokenData: data, success });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 400 },
    );
  }
}
