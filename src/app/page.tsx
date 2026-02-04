import { FeedViewer } from '../components/FeedViewer';
import { loadFeedConfig } from '../utils/server/feedLoader';
import { loadUserFeeds } from '../utils/server/userFeeds';
import { fetchAllFeeds } from '../utils/rss';
import { getUser } from '@/lib/supabase/auth';

// Revalidate every 15 minutes
export const revalidate = 900;

export default async function Home() {
    const user = await getUser();

    let feeds;
    if (user) {
        const userFeeds = await loadUserFeeds(user.id);
        // Fall back to default feeds if user has no subscriptions
        feeds = userFeeds.length > 0 ? userFeeds : await loadFeedConfig();
    } else {
        feeds = await loadFeedConfig();
    }

    const initialArticles = await fetchAllFeeds(feeds);

    return (
        <FeedViewer
            feeds={feeds}
            initialArticles={initialArticles}
        />
    );
}
