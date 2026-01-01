import type { FeedConfig } from '../../types';
import { feedsConfig } from '../../config/feeds';

export const loadFeedConfig = async (): Promise<FeedConfig[]> => {
    try {
        // Transform nested structure to flat array
        const feedsArray: FeedConfig[] = [];
        for (const [theme, feeds] of Object.entries(feedsConfig)) {
            for (const [name, config] of Object.entries(feeds)) {
                feedsArray.push({
                    url: process.env.MOCK_FEED_URL || config.url,
                    name,
                    theme
                });
            }
        }

        return feedsArray;
    } catch (error) {
        console.error('Error loading feeds config:', error);
        return [];
    }
};
