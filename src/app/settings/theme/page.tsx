import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth";
import { ThemeBuilderClient } from "./ThemeBuilderClient";
import { Palette } from "lucide-react";
import Link from "next/link";

export default async function ThemeSettingsPage() {
  const user = await getUser();
  if (!user) redirect("/");

  return (
    <div className="min-h-screen bg-theme-bg">
      <header className="sticky top-0 z-50 bg-theme-surface/90 backdrop-blur-lg shadow-sm border-b border-theme-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-theme-accent p-2.5 rounded-xl shadow-md">
              <Palette size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-theme-text">
              Custom Theme
            </h1>
          </div>
          <Link
            href="/settings"
            className="text-sm text-theme-text-muted hover:text-theme-accent font-medium transition-colors"
          >
            &larr; Back to Settings
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-theme-text-muted mb-6">
            Customize colors to create your own theme. Changes are previewed
            live. Save to persist your custom theme.
          </p>
          <ThemeBuilderClient />
        </section>
      </main>
    </div>
  );
}
