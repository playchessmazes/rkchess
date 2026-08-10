import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { getSupabaseClient } from "@/utils/supabase";
import { verifyToken } from "@/utils/auth";

const regFilePath = path.join(process.cwd(), "scratch", "registrations.json");

function getLocalRegistrations() {
  try {
    if (fs.existsSync(regFilePath)) {
      const data = fs.readFileSync(regFilePath, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading local registrations file:", err);
  }
  return [];
}

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

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "YOUR_SUPABASE_URL_HERE";

    if (isSupabaseConfigured) {
      try {
        const supabase = getSupabaseClient();
        const { data: registrations, error: dbError } = await supabase
          .from("registrations")
          .select("*")
          .order("created_at", { ascending: false });

        if (!dbError && registrations) {
          return NextResponse.json({
            success: true,
            registrations
          });
        }
      } catch (err) {
        console.warn("Supabase fetch warning (falling back to local):", err);
      }
    }

    // Fallback to local registrations file
    const localData = getLocalRegistrations();
    return NextResponse.json({
      success: true,
      registrations: localData
    });
  } catch (error) {
    console.error("Fetch registrations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
