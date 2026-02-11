import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth";
import { ThemeBuilderClient } from "./ThemeBuilderClient";
import { Palette } from "lucide-react";
import Link from "next/link";

export default async function ThemeSettingsPage() {
  const user = await getUser();
  if (!user) redirect("/");

  return (
    <div className="min-h-screen bg-gray-200">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2.5 rounded-xl shadow-md">
              <Palette size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Custom Theme
            </h1>
          </div>
          <Link
            href="/settings"
            className="text-sm text-gray-600 hover:text-purple-600 font-medium transition-colors"
          >
            &larr; Back to Settings
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-6">
            Customize colors to create your own theme. Changes are previewed
            live. Save to persist your custom theme.
          </p>
          <ThemeBuilderClient />
        </section>
      </main>
    </div>
  );
}
