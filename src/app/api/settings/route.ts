import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getCurrentDbUser } from "@/src/lib/current-user";

export async function GET() {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.settings.findUnique({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      focusDurationMinutes?: number;
      shortBreakDurationMinutes?: number;
      longBreakDurationMinutes?: number;
      spotifyPlaylistId?: string | null;
      theme?: "LIGHT" | "DARK" | "SYSTEM";
    };

    const settings = await prisma.settings.upsert({
      where: {
        userId: user.id,
      },
      update: {
        ...(typeof body.focusDurationMinutes === "number"
          ? { focusDurationMinutes: body.focusDurationMinutes }
          : {}),
        ...(typeof body.shortBreakDurationMinutes === "number"
          ? { shortBreakDurationMinutes: body.shortBreakDurationMinutes }
          : {}),
        ...(typeof body.longBreakDurationMinutes === "number"
          ? { longBreakDurationMinutes: body.longBreakDurationMinutes }
          : {}),
        ...(body.spotifyPlaylistId !== undefined
          ? { spotifyPlaylistId: body.spotifyPlaylistId }
          : {}),
        ...(body.theme ? { theme: body.theme } : {}),
      },
      create: {
        userId: user.id,
        focusDurationMinutes: body.focusDurationMinutes ?? 25,
        shortBreakDurationMinutes: body.shortBreakDurationMinutes ?? 5,
        longBreakDurationMinutes: body.longBreakDurationMinutes ?? 15,
        spotifyPlaylistId: body.spotifyPlaylistId ?? null,
        theme: body.theme ?? "SYSTEM",
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
