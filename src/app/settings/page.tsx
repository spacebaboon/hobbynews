import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/auth";
import { SettingsClient } from "./SettingsClient";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) redirect("/");

  const [subscriptions, categories, customFeeds] = await Promise.all([
    prisma.userFeedSubscription.findMany({
      where: { userId: user.id },
      include: { feed: { select: { id: true, name: true, url: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userCategory.findMany({
      where: { userId: user.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.userCustomFeed.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gray-200">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-md">
              <LayoutGrid size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Settings
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Profile */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                className="w-14 h-14 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">
                {user.user_metadata?.full_name || "No name set"}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </section>

        <SettingsClient
          initialSubscriptions={subscriptions}
          initialCategories={categories}
          initialCustomFeeds={customFeeds}
        />
      </main>
    </div>
  );
}
