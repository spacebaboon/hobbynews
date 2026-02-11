import { LayoutGrid, RefreshCw } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { LoginButton } from './auth/LoginButton';
import { UserMenu } from './auth/UserMenu';

interface FeedHeaderProps {
  themes: string[];
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  feedsCount: number;
  articlesCount: number;
  loading: boolean;
  onRefresh: () => void;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  themes,
  selectedTheme,
  onThemeChange,
  feedsCount,
  articlesCount,
  loading,
  onRefresh,
}) => {
  const { user, loading: authLoading } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-theme-surface/90 backdrop-blur-lg shadow-sm border-b border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-theme-primary to-theme-secondary p-2.5 rounded-xl shadow-md">
            <LayoutGrid size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-theme-primary">
            {selectedTheme} Feed
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-theme-background rounded-xl p-1.5 shadow-inner">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => onThemeChange(theme)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedTheme === theme
                    ? 'bg-theme-surface text-theme-primary shadow-md'
                    : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface/50'
                  }`}
              >
                {theme}
              </button>
            ))}
          </div>

          <span className="text-sm text-theme-text-muted font-medium hidden sm:block">
            {feedsCount} Sources • {articlesCount} Articles
          </span>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 hover:bg-theme-background rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh feeds"
          >
            <RefreshCw size={20} className={`text-theme-text-muted ${loading ? 'animate-spin' : ''}`} />
          </button>

          {!authLoading && (user ? <UserMenu user={user} /> : <LoginButton />)}
        </div>
      </div>
      {/* Mobile Theme Selector */}
      <div className="md:hidden max-w-7xl mx-auto px-4 pb-4 overflow-x-auto">
        <div className="flex gap-2">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => onThemeChange(theme)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${selectedTheme === theme
                  ? 'bg-theme-primary text-white shadow-md'
                  : 'bg-theme-background text-theme-text-muted hover:text-theme-text hover:bg-theme-border'
                }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
