async function test() {
  console.log("Testing FormSubmit AJAX request...");
  try {
    const textData = new FormData();
    textData.append("_subject", "Test Registration from RK Chess Academy Diagnostics (FormData)");
    textData.append("Full Name", "Test Player");
    textData.append("Age Category", "Under 11");
    textData.append("Mobile", "9876543210");
    textData.append("City", "Anantapur");

    const response = await fetch("https://submify.vercel.app/bckamal333@gmail.com", {
      method: "POST",
      body: textData
    });

    console.log("Status Code:", response.status);
    const data = await response.text();
    console.log("Response Body:", data.substring(0, 300));
  } catch (err) {
    console.error("Test Request Failed:", err);
  }
}

test();
