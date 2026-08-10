import { NextResponse } from "next/server";
import { getTournamentActiveSetting, saveTournamentActiveSetting } from "@/utils/settings";

export async function GET() {
  try {
    const isTournamentActive = await getTournamentActiveSetting();
    return NextResponse.json({ isTournamentActive });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ isTournamentActive: true });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { isTournamentActive } = body;

    if (typeof isTournamentActive !== "boolean") {
      return NextResponse.json(
        { error: "Invalid parameters. 'isTournamentActive' must be a boolean." },
        { status: 400 }
      );
    }

    await saveTournamentActiveSetting(isTournamentActive);

    return NextResponse.json({
      success: true,
      isTournamentActive,
    });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
