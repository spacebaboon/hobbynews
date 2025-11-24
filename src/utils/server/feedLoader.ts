import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { FeedConfig } from '../../types';

export const loadFeedConfig = async (): Promise<FeedConfig[]> => {
    try {
        const filePath = path.join(process.cwd(), 'feeds.yaml');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const parsed = yaml.load(fileContents) as { feeds: FeedConfig[] };
        return parsed.feeds || [];
    } catch (error) {
        console.error('Error loading feeds.yaml:', error);
        return [];
    }
};
