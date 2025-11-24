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
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => onTabChange('sites')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${sidebarTab === 'sites'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Sites
            </button>
            <button
              onClick={() => onTabChange('authors')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${sidebarTab === 'authors'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
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
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                          }`}
                      >
                        <span
                          className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-gray-700'
                            }`}
                        >
                          {site}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0 ${isSelected ? 'text-white bg-blue-600' : 'text-blue-600 bg-blue-50'
                            }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No sites found</p>
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
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                        }`}
                    >
                      <span
                        className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-gray-700'
                          }`}
                      >
                        {author}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0 ${isSelected ? 'text-white bg-blue-600' : 'text-blue-600 bg-blue-50'
                          }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No authors found</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
