import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/supabase/auth";
import Parser from "rss-parser";

const parser = new Parser();

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const { url, name, description, topicIds } = await request.json();

    if (!url?.trim()) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 },
      );
    }

    // Validate the RSS feed URL
    let feedName = name?.trim();
    let siteUrl: string | null = null;
    try {
      const feed = await parser.parseURL(url.trim());
      if (!feedName) {
        feedName = feed.title || new URL(url).hostname;
      }
      siteUrl = feed.link || null;
    } catch {
      return NextResponse.json(
        { error: "Could not parse RSS feed at this URL" },
        { status: 422 },
      );
    }

    const feedSource = await prisma.feedSource.create({
      data: {
        url: url.trim(),
        name: feedName,
        description: description?.trim() || null,
        siteUrl,
        status: "PENDING",
        submittedBy: user.id,
        topics: topicIds?.length
          ? {
              create: topicIds.map((topicId: string) => ({ topicId })),
            }
          : undefined,
      },
    });

    return NextResponse.json(feedSource, { status: 201 });
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes("Unique constraint failed")
    ) {
      return NextResponse.json(
        { error: "This feed has already been submitted" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
