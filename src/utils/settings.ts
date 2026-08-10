import fs from "fs";
import path from "path";
import { getSupabaseClient } from "@/utils/supabase";

const settingsFilePath = path.join(process.cwd(), "scratch", "settings.json");

export async function getTournamentActiveSetting(): Promise<boolean> {
  // Try Supabase if configured
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "YOUR_SUPABASE_URL_HERE";

  if (isSupabaseConfigured) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "isTournamentActive")
        .single();

      if (!error && data) {
        return data.value === true || data.value === "true";
      }
    } catch (err) {
      console.warn("Supabase settings read warning (falling back to local file):", err);
    }
  }

  // Fallback to local file
  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, "utf8");
      const parsed = JSON.parse(data);
      if (typeof parsed.isTournamentActive === "boolean") {
        return parsed.isTournamentActive;
      }
    }
  } catch (err) {
    console.error("Error reading local settings file:", err);
  }

  return false; // Default to false unless explicitly enabled in settings
}

export async function saveTournamentActiveSetting(isTournamentActive: boolean): Promise<void> {
  // Write to local file fallback
  try {
    const dir = path.dirname(settingsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(settingsFilePath, JSON.stringify({ isTournamentActive }, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing local settings file:", err);
  }

  // Write to Supabase if configured
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "YOUR_SUPABASE_URL_HERE";

  if (isSupabaseConfigured) {
    try {
      const supabase = getSupabaseClient();
      await supabase
        .from("settings")
        .upsert({ key: "isTournamentActive", value: isTournamentActive }, { onConflict: "key" });
    } catch (err) {
      console.warn("Supabase settings upsert warning:", err);
    }
  }
}
