import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/supabase/auth";

export async function GET() {
  try {
    const user = await requireUser();
    const categories = await prisma.userCategory.findMany({
      where: { userId: user.id },
      orderBy: { sortOrder: "asc" },
      include: {
        feeds: {
          include: { feed: { select: { id: true, name: true } } },
        },
      },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const { name } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 },
      );
    }

    const slug = slugify(name.trim());
    const maxOrder = await prisma.userCategory.aggregate({
      where: { userId: user.id },
      _max: { sortOrder: true },
    });

    const category = await prisma.userCategory.create({
      data: {
        userId: user.id,
        name: name.trim(),
        slug,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes("Unique constraint failed")
    ) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser();
    const { id, name, sortOrder } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (name?.trim()) {
      data.name = name.trim();
      data.slug = slugify(name.trim());
    }
    if (sortOrder !== undefined) {
      data.sortOrder = sortOrder;
    }

    const category = await prisma.userCategory.updateMany({
      where: { id, userId: user.id },
      data,
    });

    if (category.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireUser();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Unassign feeds from this category first
    await prisma.userFeedSubscription.updateMany({
      where: { categoryId: id, userId: user.id },
      data: { categoryId: null },
    });

    const result = await prisma.userCategory.deleteMany({
      where: { id, userId: user.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
