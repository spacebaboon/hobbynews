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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-md">
            <LayoutGrid size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {selectedTheme} Feed
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => onThemeChange(theme)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedTheme === theme
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {theme}
              </button>
            ))}
          </div>

          <span className="text-sm text-gray-600 font-medium hidden sm:block">
            {feedsCount} Sources • {articlesCount} Articles
          </span>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh feeds"
          >
            <RefreshCw size={20} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
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
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
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
