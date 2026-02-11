import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/auth";
import { SettingsClient } from "./SettingsClient";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) redirect("/");

  const [subscriptions, categories, customFeeds, topics] = await Promise.all([
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
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.topic.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-theme-background">
      <header className="sticky top-0 z-50 bg-theme-surface/90 backdrop-blur-lg shadow-sm border-b border-theme-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-theme-primary to-theme-secondary p-2.5 rounded-xl shadow-md">
              <LayoutGrid size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-theme-primary">
              Settings
            </h1>
          </div>
          <Link
            href="/"
            className="text-sm text-theme-text-muted hover:text-theme-primary font-medium transition-colors"
          >
            &larr; Back to Feed
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Profile */}
        <section className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-theme-text mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                className="w-14 h-14 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-theme-primary/20 flex items-center justify-center text-theme-primary font-bold text-xl">
                {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-theme-text">
                {user.user_metadata?.full_name || "No name set"}
              </p>
              <p className="text-sm text-theme-text-muted">{user.email}</p>
            </div>
          </div>
        </section>

        <SettingsClient
          initialSubscriptions={subscriptions}
          initialCategories={categories}
          initialCustomFeeds={customFeeds}
          topics={topics}
        />
      </main>
    </div>
  );
}
