import { NextResponse } from "next/server";

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

    // Simulate database insertion delay
    await new Promise((resolve) => setTimeout(resolve, 800));

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

    // Forward to Submify (keyless alternative since FormSubmit is down)
    try {
      // Parse base64 string to a Blob to send as a file attachment
      const base64Parts = paymentScreenshot.split(",");
      const base64Data = base64Parts[1];
      const mimeType = base64Parts[0].split(":")[1].split(";")[0];
      const fileExtension = mimeType.split("/")[1] || "jpeg";
      
      const buffer = Buffer.from(base64Data, "base64");
      const fileBlob = new Blob([buffer], { type: mimeType });

      // Construct FormData for Submify submission
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
      
      // Submify supports file uploads via FormData attachments
      submifyFormData.append("attachment", fileBlob, `payment_slip_${regId}.${fileExtension}`);

      const response = await fetch("https://submify.vercel.app/bckamal333@gmail.com", {
        method: "POST",
        body: submifyFormData,
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error("Submify email relay failed status:", response.status, responseText);
      }
    } catch (relayError) {
      console.error("Submify email relay failed:", relayError);
    }

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
