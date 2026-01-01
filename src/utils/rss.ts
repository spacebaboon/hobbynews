import Parser from 'rss-parser';
import he from 'he';
import type { Article, FeedConfig } from '../types';

const parser = new Parser();

export const fetchFeed = async (feedConfig: FeedConfig): Promise<Article[]> => {
    try {
        // On server side, we might not need CORS proxy if fetching directly, 
        // but keeping it for consistency if feeds block server requests.
        // However, usually server-to-server doesn't need CORS proxy.
        // Let's try direct fetch first, if it fails, we might consider proxy, 
        // but for now let's assume direct fetch works or use proxy if needed.
        // Actually, the original code used CORS proxy because of browser CORS.
        // On server, we don't need it.

        const response = await fetch(feedConfig.url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${feedConfig.url}: ${response.statusText}`);
        }
        const text = await response.text();

        const feed = await parser.parseString(text);

        return feed.items.map((item) => ({
            title: item.title ? he.decode(item.title) : 'No Title',
            link: item.link || '#',
            pubDate: item.pubDate || new Date().toISOString(),
            contentSnippet: item.contentSnippet,
            content: item.content,
            creator: item.creator ? he.decode(item.creator) : undefined,
            isoDate: item.isoDate,
            feedName: feedConfig.name,
        }));
    } catch (error) {
        // Log detailed error for debugging purposes
        console.error(`Error fetching feed ${feedConfig.name} (${feedConfig.url}):`, error);
        // We return empty array so that other feeds can still populate the page
        return [];
    }
};

export const fetchAllFeeds = async (configs: FeedConfig[]): Promise<Article[]> => {
    const promises = configs.map(fetchFeed);
    const results = await Promise.all(promises);
    return results.flat().sort((a, b) => {
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });
};
