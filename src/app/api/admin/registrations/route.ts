import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseClient } from "@/utils/supabase";
import { verifyToken } from "@/utils/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Session expired or invalid" }, { status: 401 });
    }

    const supabase = getSupabaseClient();
    const { data: registrations, error: dbError } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error("Database query error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      registrations: registrations || []
    });
  } catch (error) {
    console.error("Fetch registrations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
