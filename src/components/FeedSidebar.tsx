import { useRef, useEffect } from 'react';

interface FeedSidebarProps {
  sidebarTab: 'sites' | 'authors';
  onTabChange: (tab: 'sites' | 'authors') => void;
  sites: Array<{ site: string; count: number }>;
  authors: Array<{ author: string; count: number }>;
  selectedSites: Set<string>;
  selectedAuthors: Set<string>;
  onToggleSite: (site: string) => void;
  onToggleAuthor: (author: string) => void;
}

export const FeedSidebar: React.FC<FeedSidebarProps> = ({
  sidebarTab,
  onTabChange,
  sites,
  authors,
  selectedSites,
  selectedAuthors,
  onToggleSite,
  onToggleAuthor,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [sidebarTab]);

  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="sticky top-24">
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 shadow-sm">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 bg-theme-background rounded-xl p-1">
            <button
              onClick={() => onTabChange('sites')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${sidebarTab === 'sites'
                ? 'bg-theme-surface text-theme-primary shadow-md'
                : 'text-theme-text-muted hover:text-theme-text'
                }`}
            >
              Sites
            </button>
            <button
              onClick={() => onTabChange('authors')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${sidebarTab === 'authors'
                ? 'bg-theme-surface text-theme-primary shadow-md'
                : 'text-theme-text-muted hover:text-theme-text'
                }`}
            >
              Authors
            </button>
          </div>

          {/* Content */}
          <div ref={scrollContainerRef} className="max-h-[calc(100vh-16rem)] overflow-y-auto">
            {sidebarTab === 'sites' ? (
              sites.length > 0 ? (
                <div className="space-y-2">
                  {sites.map(({ site, count }) => {
                    const isSelected = selectedSites.has(site);
                    return (
                      <button
                        key={site}
                        onClick={() => onToggleSite(site)}
                        className={`w-full flex items-center justify-between py-2 px-3 rounded-lg transition-all ${isSelected
                          ? 'bg-theme-primary/20 border-2 border-theme-primary'
                          : 'hover:bg-theme-background border-2 border-transparent'
                          }`}
                      >
                        <span
                          className={`text-sm font-medium truncate ${isSelected ? 'text-theme-primary' : 'text-theme-text'
                            }`}
                        >
                          {site}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0 ${isSelected ? 'text-white bg-theme-primary' : 'text-theme-primary bg-theme-primary/10'
                            }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-theme-text-muted">No sites found</p>
              )
            ) : authors.length > 0 ? (
              <div className="space-y-2">
                {authors.map(({ author, count }) => {
                  const isSelected = selectedAuthors.has(author);
                  return (
                    <button
                      key={author}
                      onClick={() => onToggleAuthor(author)}
                      className={`w-full flex items-center justify-between py-2 px-3 rounded-lg transition-all ${isSelected
                        ? 'bg-theme-primary/20 border-2 border-theme-primary'
                        : 'hover:bg-theme-background border-2 border-transparent'
                        }`}
                    >
                      <span
                        className={`text-sm font-medium truncate ${isSelected ? 'text-theme-primary' : 'text-theme-text'
                          }`}
                      >
                        {author}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0 ${isSelected ? 'text-white bg-theme-primary' : 'text-theme-primary bg-theme-primary/10'
                          }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-theme-text-muted">No authors found</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
