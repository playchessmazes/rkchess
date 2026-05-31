const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Manually parse .env.local
const envPath = path.join(__dirname, ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("No .env.local file found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2 && !line.startsWith("#")) {
    const key = parts[0].trim();
    const val = parts.slice(1).join("=").trim();
    envVars[key] = val;
  }
});

const supabaseUrl = envVars["NEXT_PUBLIC_SUPABASE_URL"];
const supabaseServiceKey = envVars["SUPABASE_SERVICE_ROLE_KEY"] || envVars["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or API keys in .env.local!");
  process.exit(1);
}

console.log("Connecting to Supabase at:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runDiagnostics() {
  try {
    // 1. Test database connection
    console.log("\n--- Testing Database Table registrations ---");
    const { data: dbData, error: dbError } = await supabase
      .from("registrations")
      .select("id, full_name, screenshot_url")
      .limit(5);

    if (dbError) {
      console.error("❌ Database select failed:", dbError.message);
    } else {
      console.log("✅ Database query successful! Registrations found:", dbData.length);
      console.log("Recent registrations:", dbData);
    }

    // 2. List storage buckets
    console.log("\n--- Listing Storage Buckets ---");
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

    if (storageError) {
      console.error("❌ Failed to list buckets:", storageError.message);
    } else {
      console.log("✅ Successfully fetched storage buckets!");
      console.log("Found buckets:", buckets.map(b => ({
        name: b.name,
        public: b.public,
        file_size_limit: b.file_size_limit
      })));

      const screenshotsBucket = buckets.find(b => b.name === "screenshots");
      if (!screenshotsBucket) {
        console.error("❌ ERROR: No bucket named 'screenshots' exists! Please create it.");
      } else if (!screenshotsBucket.public) {
        console.warn("⚠️ WARNING: The 'screenshots' bucket exists but is PRIVATE. It MUST be set to PUBLIC so that image links can be viewed in the dashboard.");
      } else {
        console.log("✅ 'screenshots' bucket exists and is PUBLIC.");
      }
    }

    // 3. List files in screenshots bucket
    console.log("\n--- Listing Files in 'screenshots' Bucket ---");
    const { data: files, error: filesError } = await supabase.storage.from("screenshots").list();
    
    if (filesError) {
      console.error("❌ Failed to list files in 'screenshots':", filesError.message);
    } else {
      console.log("✅ Successfully listed files!");
      console.log("Files found in screenshots:", files.map(f => f.name));
    }

  } catch (err) {
    console.error("Diagnostics threw an error:", err);
  }
}

runDiagnostics();
