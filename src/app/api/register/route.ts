import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/utils/supabase";

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

    // Simple Server-side validation
    if (!fullName || !dob || !gender || !mobile || !category || !cityState || !paymentScreenshot) {
      return NextResponse.json(
        { error: "Missing required fields. Please ensure all details and payment screenshot are provided." },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "YOUR_SUPABASE_URL_HERE" &&
      ((process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== "YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE") ||
       (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY !== "YOUR_SUPABASE_PUBLISHABLE_KEY_HERE"));

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: "Supabase database credentials are not configured yet. Please update the .env.local file with your Project URL and API Key." },
        { status: 500 }
      );
    }

    // Initialize Supabase Client
    const supabase = getSupabaseClient();

    // Generate a unique registration ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const regId = `RKC-SUM-${category.toUpperCase().substring(0, 3)}-${randomNum}`;

    // Map category value to readable label
    const categoryLabels: { [key: string]: string } = {
      u7: "Under 7",
      u9: "Under 9",
      u11: "Under 11",
      u13: "Under 13",
      u15: "Under 15",
      open: "Open (All Ages)",
    };
    const readableCategory = categoryLabels[category] || category;

    // Decode base64 payment screenshot and upload to Supabase Storage
    let screenshotUrl = "";
    try {
      const base64Parts = paymentScreenshot.split(",");
      const base64Data = base64Parts[1];
      const mimeType = base64Parts[0].split(":")[1].split(";")[0];
      const fileExtension = mimeType.split("/")[1] || "jpeg";
      
      const buffer = Buffer.from(base64Data, "base64");
      
      // Upload screenshot to Supabase Storage bucket 'screenshots'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("screenshots")
        .upload(`payment_slip_${regId}.${fileExtension}`, buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (uploadError) {
        console.error("Supabase Storage upload error:", uploadError);
        return NextResponse.json(
          { error: `Failed to upload payment screenshot: ${uploadError.message}` },
          { status: 500 }
        );
      }

      // Get public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from("screenshots")
        .getPublicUrl(`payment_slip_${regId}.${fileExtension}`);
      
      screenshotUrl = publicUrl;
    } catch (uploadFail) {
      console.error("Failed processing screenshot upload:", uploadFail);
      return NextResponse.json(
        { error: "Error processing payment screenshot file format." },
        { status: 500 }
      );
    }

    // Insert registration details into registrations table
    const { error: dbError } = await supabase
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

    if (dbError) {
      console.error("Supabase database insert error:", dbError);
      return NextResponse.json(
        { error: `Failed to save registration in database: ${dbError.message}` },
        { status: 500 }
      );
    }

    // Fire-and-forget: Relay email via Submify in background
    // This runs asynchronously without blocking the client's HTTP response.
    (async () => {
      try {
        const base64Parts = paymentScreenshot.split(",");
        const base64Data = base64Parts[1];
        const mimeType = base64Parts[0].split(":")[1].split(";")[0];
        const fileExtension = mimeType.split("/")[1] || "jpeg";
        const buffer = Buffer.from(base64Data, "base64");
        const fileBlob = new Blob([buffer], { type: mimeType });

        const submifyFormData = new FormData();
        submifyFormData.append("_subject", `New Registration - ${regId} (${fullName})`);
        submifyFormData.append("Registration ID", regId);
        submifyFormData.append("Full Name", fullName);
        submifyFormData.append("Date of Birth", dob);
        submifyFormData.append("Gender", gender === "male" ? "Boy" : "Girl");
        submifyFormData.append("Mobile / WhatsApp", mobile);
        submifyFormData.append("Email Address", email || "Not provided");
        submifyFormData.append("Age Category", readableCategory);
        submifyFormData.append("City & State", cityState);
        submifyFormData.append("School or Club", academyName || "Not provided");
        
        if (fideId) submifyFormData.append("FIDE ID", fideId);
        if (fideRating) submifyFormData.append("FIDE Rating", fideRating);
        
        submifyFormData.append("attachment", fileBlob, `payment_slip_${regId}.${fileExtension}`);
        submifyFormData.append("Screenshot URL", screenshotUrl); // Include the Supabase URL in the form too!

        const emailResponse = await fetch("https://submify.vercel.app/bckamal333@gmail.com", {
          method: "POST",
          body: submifyFormData,
        });

        if (!emailResponse.ok) {
          console.error("Submify email relay failed status:", emailResponse.status);
        }
      } catch (err) {
        console.error("Background email relay failed:", err);
      }
    })();

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
