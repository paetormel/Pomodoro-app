import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getCurrentDbUser } from "@/src/lib/current-user";

export async function GET() {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.pomodoroSession.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching pomodoro sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      sessionType?: "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";
      durationMinutes?: number;
      label?: string | null;
      isCompleted?: boolean;
      startedAt?: string;
    };

    if (!body.sessionType || typeof body.durationMinutes !== "number") {
      return NextResponse.json(
        { error: "sessionType and durationMinutes are required" },
        { status: 400 }
      );
    }

    const session = await prisma.pomodoroSession.create({
      data: {
        userId: user.id,
        sessionType: body.sessionType,
        durationMinutes: body.durationMinutes,
        label: body.label ?? null,
        isCompleted: body.isCompleted ?? true,
        ...(body.startedAt ? { startedAt: new Date(body.startedAt) } : {}),
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Error creating pomodoro session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
