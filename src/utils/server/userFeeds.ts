import { prisma } from "@/lib/prisma";
import type { FeedConfig } from "@/types";

/**
 * Load feed configs for an authenticated user.
 * Returns subscribed gallery feeds + custom feeds.
 * Themes are derived from topics (for gallery feeds) or "Custom" (for user feeds).
 */
export async function loadUserFeeds(userId: string): Promise<FeedConfig[]> {
  const [subscriptions, customFeeds] = await Promise.all([
    prisma.userFeedSubscription.findMany({
      where: { userId },
      include: {
        feed: {
          include: {
            topics: { include: { topic: true } },
          },
        },
        category: true,
      },
    }),
    prisma.userCustomFeed.findMany({
      where: { userId },
    }),
  ]);

  const feeds: FeedConfig[] = [];

  for (const sub of subscriptions) {
    // Use user's category name, or the first topic name, or "Uncategorized"
    const theme =
      sub.category?.name ||
      sub.feed.topics[0]?.topic.name ||
      "Uncategorized";

    feeds.push({
      url: sub.feed.url,
      name: sub.feed.name,
      theme,
    });
  }

  for (const custom of customFeeds) {
    feeds.push({
      url: custom.url,
      name: custom.name,
      theme: "Custom",
    });
  }

  return feeds;
}
