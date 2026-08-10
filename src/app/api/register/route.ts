import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSupabaseClient } from "@/utils/supabase";

// Local fallback registrations file path
const regFilePath = path.join(process.cwd(), "scratch", "registrations.json");

function saveLocalRegistration(record: any) {
  try {
    const dir = path.dirname(regFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let list: any[] = [];
    if (fs.existsSync(regFilePath)) {
      const data = fs.readFileSync(regFilePath, "utf8");
      list = JSON.parse(data);
    }
    list.unshift(record);
    fs.writeFileSync(regFilePath, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing local registration fallback file:", err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      dob,
      gender,
      mobile,
      email,
      fideId,
      fideRating,
      category,
      academyName,
      cityState,
      paymentScreenshot,
    } = body;

    // Validation
    if (!fullName || !dob || !gender || !mobile || !category || !cityState || !paymentScreenshot) {
      return NextResponse.json(
        { error: "Missing required fields. Please ensure all details and payment screenshot are provided." },
        { status: 400 }
      );
    }

    // Generate unique registration ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const regId = `RKC-SUM-${category.toUpperCase().substring(0, 3)}-${randomNum}`;

    const categoryLabels: { [key: string]: string } = {
      u7: "Under 7",
      u9: "Under 9",
      u11: "Under 11",
      u13: "Under 13",
      u15: "Under 15",
      open: "Open Category",
    };
    const readableCategory = categoryLabels[category] || category;

    // Check if Supabase is configured
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "YOUR_SUPABASE_URL_HERE" &&
      ((process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== "YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE") ||
       (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY !== "YOUR_SUPABASE_PUBLISHABLE_KEY_HERE"));

    let screenshotUrl = paymentScreenshot; // Default to base64 or fallback

    if (isSupabaseConfigured) {
      try {
        const supabase = getSupabaseClient();
        const base64Parts = paymentScreenshot.split(",");
        const base64Data = base64Parts[1];
        const mimeType = base64Parts[0].split(":")[1].split(";")[0];
        const fileExtension = mimeType.split("/")[1] || "jpeg";
        const buffer = Buffer.from(base64Data, "base64");

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("screenshots")
          .upload(`payment_slip_${regId}.${fileExtension}`, buffer, {
            contentType: mimeType,
            upsert: true
          });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("screenshots")
            .getPublicUrl(`payment_slip_${regId}.${fileExtension}`);
          screenshotUrl = publicUrl;
        }

        // Save into Supabase table
        await supabase
          .from("registrations")
          .insert({
            id: regId,
            full_name: fullName,
            dob: dob,
            gender: gender === "male" ? "Boy" : "Girl",
            mobile: mobile,
            email: email || null,
            fide_id: fideId || null,
            fide_rating: fideRating ? parseInt(fideRating) : null,
            category: category,
            academy_name: academyName || null,
            city_state: cityState,
            screenshot_url: screenshotUrl
          });
      } catch (err) {
        console.warn("Supabase insert warning (falling back to local storage):", err);
      }
    }

    // Save locally as fallback so submission NEVER fails
    saveLocalRegistration({
      id: regId,
      created_at: new Date().toISOString(),
      full_name: fullName,
      dob: dob,
      gender: gender === "male" ? "Boy" : "Girl",
      mobile: mobile,
      email: email || null,
      fide_id: fideId || null,
      fide_rating: fideRating ? parseInt(fideRating) : null,
      category: category,
      academy_name: academyName || null,
      city_state: cityState,
      screenshot_url: screenshotUrl
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful!",
      registrationId: regId,
      player: {
        fullName,
        category: readableCategory,
        email: email || "Not provided",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your registration. Please try again." },
      { status: 500 }
    );
  }
}
