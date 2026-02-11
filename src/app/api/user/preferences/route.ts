import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/supabase/auth";

export async function GET() {
  try {
    const user = await requireUser();
    const prefs = await prisma.userPreferences.findUnique({
      where: { userId: user.id },
      include: { theme: true },
    });
    return NextResponse.json(prefs);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { themeId, customTheme } = body;

    const prefs = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        ...(themeId !== undefined && { themeId }),
        ...(customTheme !== undefined && { customTheme }),
      },
      create: {
        userId: user.id,
        themeId: themeId || null,
        customTheme: customTheme || null,
      },
      include: { theme: true },
    });

    return NextResponse.json(prefs);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
