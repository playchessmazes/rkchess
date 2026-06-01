import { NextResponse } from "next/server";
import { createToken } from "@/utils/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username/Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedUser = username.toLowerCase().trim();
    
    // Static admin credentials check
    if (normalizedUser !== "admin@rkchess2026.com" || password !== "rkchess2026@dmin") {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Generate secure session token (expiring in 24 hours)
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    const token = createToken({
      userId: "static-admin-id",
      username: "admin@rkchess2026.com",
      exp: expiry
    });

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully!"
    });

    // Set cookie on response
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An error occurred while logging in." },
      { status: 500 }
    );
  }
}
