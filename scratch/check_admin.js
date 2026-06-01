const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../.env.local");
if (!fs.existsSync(envPath)) {
  console.error("No .env.local file found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2 && !line.startsWith("#")) {
    envVars[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
});

const supabaseUrl = envVars["NEXT_PUBLIC_SUPABASE_URL"];
const supabaseServiceKey = envVars["SUPABASE_SERVICE_ROLE_KEY"] || envVars["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  console.log("Checking admin_users table...");
  const { data, error } = await supabase.from("admin_users").select("*").limit(1);
  if (error) {
    console.log("admin_users table error:", error.message);
  } else {
    console.log("admin_users table exists! Data:", data);
  }

  console.log("Checking admins table...");
  const { data: data2, error: error2 } = await supabase.from("admins").select("*").limit(1);
  if (error2) {
    console.log("admins table error:", error2.message);
  } else {
    console.log("admins table exists! Data:", data2);
  }
}

check();
