"use client";

import { useState } from "react";
import { Trash2, Plus, Rss, FolderOpen, X } from "lucide-react";

interface Subscription {
  id: string;
  feedId: string;
  categoryId: string | null;
  feed: { id: string; name: string; url: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

interface CustomFeed {
  id: string;
  url: string;
  name: string;
  categoryId: string | null;
}

interface SettingsClientProps {
  initialSubscriptions: Subscription[];
  initialCategories: Category[];
  initialCustomFeeds: CustomFeed[];
}

export function SettingsClient({
  initialSubscriptions,
  initialCategories,
  initialCustomFeeds,
}: SettingsClientProps) {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [categories, setCategories] = useState(initialCategories);
  const [customFeeds, setCustomFeeds] = useState(initialCustomFeeds);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedName, setNewFeedName] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [feedLoading, setFeedLoading] = useState(false);

  async function unsubscribe(feedId: string) {
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedId }),
    });
    if (res.ok) {
      setSubscriptions((s) => s.filter((sub) => sub.feedId !== feedId));
    }
  }

  async function addCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    setCategoryError(null);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategories((c) => [...c, cat]);
      setNewCategoryName("");
    } else {
      const data = await res.json();
      setCategoryError(data.error || "Failed to add category");
    }
  }

  async function deleteCategory(id: string) {
    const res = await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setCategories((c) => c.filter((cat) => cat.id !== id));
    }
  }

  async function addCustomFeed() {
    const url = newFeedUrl.trim();
    if (!url) return;
    setFeedError(null);
    setFeedLoading(true);
    const res = await fetch("/api/custom-feeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, name: newFeedName.trim() || undefined }),
    });
    setFeedLoading(false);
    if (res.ok) {
      const feed = await res.json();
      setCustomFeeds((f) => [feed, ...f]);
      setNewFeedUrl("");
      setNewFeedName("");
    } else {
      const data = await res.json();
      setFeedError(data.error || "Failed to add feed");
    }
  }

  async function deleteCustomFeed(id: string) {
    const res = await fetch("/api/custom-feeds", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setCustomFeeds((f) => f.filter((feed) => feed.id !== id));
    }
  }

  return (
    <>
      {/* Subscriptions */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Subscriptions ({subscriptions.length})
        </h2>
        {subscriptions.length === 0 ? (
          <p className="text-sm text-gray-500">
            No subscriptions yet.{" "}
            <a href="/gallery" className="text-blue-600 hover:underline">
              Browse the gallery
            </a>{" "}
            to subscribe to feeds.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {subscriptions.map((sub) => (
              <li
                key={sub.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Rss size={16} className="text-orange-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {sub.feed.name}
                  </span>
                </div>
                <button
                  onClick={() => unsubscribe(sub.feedId)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Unsubscribe"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Categories */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
        {categories.length > 0 && (
          <ul className="divide-y divide-gray-100 mb-4">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <FolderOpen
                    size={16}
                    className="text-blue-500 flex-shrink-0"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {cat.name}
                  </span>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="New category name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCategory}
            disabled={!newCategoryName.trim()}
            className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
        {categoryError && (
          <p className="text-sm text-red-500 mt-2">{categoryError}</p>
        )}
      </section>

      {/* Custom Feeds */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Custom Feeds</h2>
        {customFeeds.length > 0 && (
          <ul className="divide-y divide-gray-100 mb-4">
            {customFeeds.map((feed) => (
              <li
                key={feed.id}
                className="flex items-center justify-between py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {feed.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{feed.url}</p>
                </div>
                <button
                  onClick={() => deleteCustomFeed(feed.id)}
                  className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"
                  title="Remove feed"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="space-y-2">
          <input
            type="url"
            value={newFeedUrl}
            onChange={(e) => setNewFeedUrl(e.target.value)}
            placeholder="RSS feed URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeedName}
              onChange={(e) => setNewFeedName(e.target.value)}
              placeholder="Name (optional, auto-detected)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addCustomFeed}
              disabled={!newFeedUrl.trim() || feedLoading}
              className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={14} />
              {feedLoading ? "Validating..." : "Add"}
            </button>
          </div>
          {feedError && (
            <p className="text-sm text-red-500">{feedError}</p>
          )}
        </div>
      </section>
    </>
  );
}
