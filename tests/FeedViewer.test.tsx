import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeedViewer } from '../src/components/FeedViewer';
import type { Article, FeedConfig } from '../src/types';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

const mockArticles: Article[] = [
  {
    title: 'Article 1',
    link: 'https://example.com/1',
    pubDate: new Date().toISOString(),
    feedName: 'Test Feed',
    contentSnippet: 'Snippet 1',
  },
  {
    title: 'Article 2',
    link: 'https://example.com/2',
    pubDate: new Date().toISOString(),
    feedName: 'Test Feed 2',
    contentSnippet: 'Snippet 2',
  },
];

const mockFeeds: FeedConfig[] = [
  {
    name: 'Test Feed',
    url: 'https://example.com/rss',
    theme: 'Tech',
  },
  {
    name: 'Test Feed 2',
    url: 'https://example.com/rss2',
    theme: 'News',
  },
];

describe('FeedViewer', () => {
  it('renders articles correctly', () => {
    render(<FeedViewer initialArticles={mockArticles} feeds={mockFeeds} />);

    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
  });

  it('filters articles by theme', () => {
    render(<FeedViewer initialArticles={mockArticles} feeds={mockFeeds} />);

    // There are multiple buttons (desktop and mobile), pick one
    const themeButtons = screen.getAllByText('Tech');
    fireEvent.click(themeButtons[0]);

    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.queryByText('Article 2')).not.toBeInTheDocument();
  });
});
