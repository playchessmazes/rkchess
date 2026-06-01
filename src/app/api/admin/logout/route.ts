import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully!"
    });

    // Delete cookie by setting its maxAge to 0 (or expires in past)
    response.cookies.set({
      name: "admin_token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout." },
      { status: 500 }
    );
  }
}
