import { FeedViewer } from '../components/FeedViewer';
import { loadFeedConfig } from '../utils/server/feedLoader';
import { fetchAllFeeds } from '../utils/rss';

// Revalidate every 15 minutes
export const revalidate = 900;

export default async function Home() {
    const feeds = await loadFeedConfig();
    const initialArticles = await fetchAllFeeds(feeds);

    return (
        <FeedViewer
            feeds={feeds}
            initialArticles={initialArticles}
        />
    );
}
