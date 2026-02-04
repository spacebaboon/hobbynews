import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/supabase/auth";

async function requireAdmin() {
  const supaUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: supaUser.id },
    select: { isAdmin: true },
  });
  if (!user?.isAdmin) {
    throw new Error("Forbidden");
  }
  return supaUser;
}

export async function GET() {
  try {
    await requireAdmin();
    const feeds = await prisma.feedSource.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        topics: { include: { topic: true } },
      },
    });
    return NextResponse.json(feeds);
  } catch (err) {
    const status =
      err instanceof Error && err.message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unauthorized" }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { id, action, name, description, topicIds } = await request.json();

    if (!id || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "id and action (approve|reject) are required" },
        { status: 400 },
      );
    }

    if (action === "approve") {
      await prisma.feedSource.update({
        where: { id },
        data: {
          status: "APPROVED",
          approvedBy: admin.id,
          ...(name?.trim() && { name: name.trim() }),
          ...(description?.trim() && { description: description.trim() }),
        },
      });

      // Update topics if provided
      if (topicIds?.length) {
        await prisma.feedTopic.deleteMany({ where: { feedId: id } });
        await prisma.feedTopic.createMany({
          data: topicIds.map((topicId: string) => ({ feedId: id, topicId })),
        });
      }
    } else {
      await prisma.feedSource.update({
        where: { id },
        data: { status: "REJECTED", approvedBy: admin.id },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const status =
      err instanceof Error && err.message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unauthorized" }, { status });
  }
}
