import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/auth";
import { TopicSection } from "@/components/gallery/TopicSection";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

export default async function GalleryPage() {
  const user = await getUser();

  const [topics, subscribedFeedIds] = await Promise.all([
    prisma.topic.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        feeds: {
          include: {
            feed: {
              include: {
                _count: { select: { subscribers: true } },
              },
            },
          },
          where: { feed: { status: "APPROVED" } },
        },
      },
    }),
    user
      ? prisma.userFeedSubscription
          .findMany({
            where: { userId: user.id },
            select: { feedId: true },
          })
          .then((subs) => new Set(subs.map((s) => s.feedId)))
      : Promise.resolve(new Set<string>()),
  ]);

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gray-200">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-md">
              <LayoutGrid size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Feed Gallery
            </h1>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            &larr; Back to Feed
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {topics.map((topic) => (
          <TopicSection
            key={topic.id}
            name={topic.name}
            description={topic.description}
            feeds={topic.feeds.map((ft) => ({
              id: ft.feed.id,
              name: ft.feed.name,
              description: ft.feed.description,
              siteUrl: ft.feed.siteUrl,
              _count: ft.feed._count,
            }))}
            subscribedFeedIds={subscribedFeedIds}
            isLoggedIn={isLoggedIn}
          />
        ))}

        {topics.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No feeds available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
