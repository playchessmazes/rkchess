import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { getSupabaseClient } from "@/utils/supabase";
import { verifyToken } from "@/utils/auth";

const regFilePath = path.join(process.cwd(), "scratch", "registrations.json");

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Clear local JSON fallback if present
    try {
      if (fs.existsSync(regFilePath)) {
        fs.writeFileSync(regFilePath, JSON.stringify([], null, 2), "utf8");
      }
    } catch (err) {
      console.error("Error clearing local registrations file:", err);
    }

    // 2. Clear Supabase table & bucket if configured
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "YOUR_SUPABASE_URL_HERE";

    if (isSupabaseConfigured) {
      try {
        const supabase = getSupabaseClient();
        
        // Delete all rows from registrations table
        const { error: deleteError } = await supabase
          .from("registrations")
          .delete()
          .neq("id", "0"); // deletes all records

        if (deleteError) {
          console.error("Supabase clear rows error:", deleteError);
        }

        // Delete screenshot files from storage bucket
        const { data: files } = await supabase.storage.from("screenshots").list();
        if (files && files.length > 0) {
          const fileNames = files.map((f) => f.name);
          await supabase.storage.from("screenshots").remove(fileNames);
        }
      } catch (err) {
        console.warn("Supabase clear data error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "All registration data deleted successfully."
    });
  } catch (error) {
    console.error("Clear data error:", error);
    return NextResponse.json({ error: "Failed to clear registration data." }, { status: 500 });
  }
}
