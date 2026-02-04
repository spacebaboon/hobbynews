import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/supabase/auth";

export async function GET() {
  try {
    const user = await requireUser();
    const subscriptions = await prisma.userFeedSubscription.findMany({
      where: { userId: user.id },
      select: { feedId: true },
    });
    return NextResponse.json(subscriptions.map((s) => s.feedId));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const { feedId } = await request.json();

    if (!feedId) {
      return NextResponse.json(
        { error: "feedId is required" },
        { status: 400 },
      );
    }

    // Toggle: if already subscribed, unsubscribe; otherwise subscribe
    const existing = await prisma.userFeedSubscription.findUnique({
      where: { userId_feedId: { userId: user.id, feedId } },
    });

    if (existing) {
      await prisma.userFeedSubscription.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ subscribed: false });
    }

    await prisma.userFeedSubscription.create({
      data: { userId: user.id, feedId },
    });
    return NextResponse.json({ subscribed: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
