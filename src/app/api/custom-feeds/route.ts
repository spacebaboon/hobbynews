import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/supabase/auth";
import Parser from "rss-parser";

const parser = new Parser();

export async function GET() {
  try {
    const user = await requireUser();
    const feeds = await prisma.userCustomFeed.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(feeds);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const { url, name, categoryId } = await request.json();

    if (!url?.trim()) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 },
      );
    }

    // Validate the RSS feed URL
    let feedName = name?.trim();
    try {
      const feed = await parser.parseURL(url.trim());
      if (!feedName) {
        feedName = feed.title || new URL(url).hostname;
      }
    } catch {
      return NextResponse.json(
        { error: "Could not parse RSS feed at this URL" },
        { status: 422 },
      );
    }

    const customFeed = await prisma.userCustomFeed.create({
      data: {
        userId: user.id,
        url: url.trim(),
        name: feedName,
        categoryId: categoryId || null,
      },
    });

    return NextResponse.json(customFeed, { status: 201 });
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes("Unique constraint failed")
    ) {
      return NextResponse.json(
        { error: "You already added this feed" },
        { status: 409 },
      );
    }
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

    const result = await prisma.userCustomFeed.deleteMany({
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
