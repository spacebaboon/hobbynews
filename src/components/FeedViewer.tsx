'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import type { Article, FeedConfig } from '../types';
import { FeedHeader } from './FeedHeader';
import { FeedSidebar } from './FeedSidebar';
import { ArticleCard } from './ArticleCard';

interface FeedViewerProps {
  initialArticles: Article[];
  feeds: FeedConfig[];
}

export const FeedViewer: React.FC<FeedViewerProps> = ({ initialArticles, feeds }) => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isPending, startTransition] = useTransition();
  const [error] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [sidebarTab, setSidebarTab] = useState<'sites' | 'authors'>('sites');
  const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set());
  const [selectedAuthors, setSelectedAuthors] = useState<Set<string>>(new Set());

  // Update articles when initialArticles changes (e.g. after router.refresh())
  if (initialArticles !== articles) {
     setArticles(initialArticles);
  }

  const refresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const toggleSite = (site: string) => {
    setSelectedSites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(site)) {
        newSet.delete(site);
      } else {
        newSet.add(site);
      }
      return newSet;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAuthor = (author: string) => {
    setSelectedAuthors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(author)) {
        newSet.delete(author);
      } else {
        newSet.add(author);
      }
      return newSet;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: 'sites' | 'authors') => {
    setSidebarTab(tab);
    setSelectedSites(new Set());
    setSelectedAuthors(new Set());
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setSelectedSites(new Set());
    setSelectedAuthors(new Set());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const themes = ['All', ...new Set(feeds.map((f) => f.theme).filter(Boolean))];

  // Filter articles by theme only (for sidebar stats)
  const themeFilteredArticles = articles.filter((article) => {
    if (selectedTheme === 'All') return true;
    const feed = feeds.find((f) => f.name === article.feedName);
    return feed?.theme === selectedTheme;
  });

  // Filter articles by theme + sites + authors (for display)
  const filteredArticles = themeFilteredArticles.filter((article) => {
    // Filter by selected sites
    if (selectedSites.size > 0 && !selectedSites.has(article.feedName)) {
      return false;
    }

    // Filter by selected authors
    if (selectedAuthors.size > 0 && (!article.creator || !selectedAuthors.has(article.creator))) {
      return false;
    }

    return true;
  });

  // Calculate author statistics (from theme-filtered articles only)
  const authorCounts = themeFilteredArticles.reduce((acc, article) => {
    if (article.creator) {
      acc[article.creator] = (acc[article.creator] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const sortedAuthors = Object.entries(authorCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([author, count]) => ({ author, count }));

  // Calculate site statistics (from theme-filtered articles only)
  const siteCounts = themeFilteredArticles.reduce((acc, article) => {
    acc[article.feedName] = (acc[article.feedName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedSites = Object.entries(siteCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([site, count]) => ({ site, count }));

  // Calculate feeds count for the selected theme
  const themeFilteredFeedsCount = selectedTheme === 'All'
    ? feeds.length
    : feeds.filter(f => f.theme === selectedTheme).length;

  return (
    <div className="min-h-screen bg-theme-background text-theme-text font-sans selection:bg-theme-primary selection:text-white">
      <FeedHeader
        themes={themes}
        selectedTheme={selectedTheme}
        onThemeChange={handleThemeChange}
        feedsCount={themeFilteredFeedsCount}
        articlesCount={filteredArticles.length}
        loading={isPending}
        onRefresh={refresh}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {error && (
              <div className="bg-red-50 rounded-2xl p-6 mb-6 flex items-center gap-4 text-red-700">
                <AlertCircle size={24} />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {isPending && articles.length === 0 ? (
              <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-theme-surface rounded-2xl p-8 h-64 animate-pulse">
                    <div className="h-4 bg-theme-border rounded w-1/4 mb-5"></div>
                    <div className="h-6 bg-theme-border rounded w-3/4 mb-5"></div>
                    <div className="h-4 bg-theme-border rounded w-full mb-3"></div>
                    <div className="h-4 bg-theme-border rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredArticles.map((article, index) => (
                  <ArticleCard key={`${article.link}-${index}`} article={article} />
                ))}
              </div>
            )}

            {!isPending && filteredArticles.length === 0 && !error && (
              <div className="text-center py-32">
                <p className="text-gray-500 text-lg font-medium">No articles found for this theme.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <FeedSidebar
            sidebarTab={sidebarTab}
            onTabChange={handleTabChange}
            sites={sortedSites}
            authors={sortedAuthors}
            selectedSites={selectedSites}
            selectedAuthors={selectedAuthors}
            onToggleSite={toggleSite}
            onToggleAuthor={toggleAuthor}
          />
        </div>
      </main>
    </div>
  );
};
