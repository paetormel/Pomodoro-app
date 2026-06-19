import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getCurrentDbUser } from "@/src/lib/current-user";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      ids?: string[];
    };

    if (!Array.isArray(body.ids)) {
      return NextResponse.json(
        { error: "ids array is required" },
        { status: 400 }
      );
    }

    await prisma.$transaction(
      body.ids.map((id, index) =>
        prisma.todo.updateMany({
          where: {
            id,
            userId: user.id,
          },
          data: {
            sortOrder: index,
          },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error reordering todos:", error);
    return NextResponse.json(
      { error: "Failed to reorder todos" },
      { status: 500 }
    );
  }
}
