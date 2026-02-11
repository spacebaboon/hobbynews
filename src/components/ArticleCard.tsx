import React from 'react';
import type { Article } from '../types';
import { ExternalLink, Calendar, User, Rss } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
    article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const formattedDate = article.pubDate
        ? formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })
        : 'Unknown date';

    return (
        <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block group no-underline"
        >
            <div className="bg-theme-surface border border-theme-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-theme-primary uppercase tracking-wider">
                    <Rss size={14} />
                    <span>{article.feedName}</span>
                </div>

                <h3 className="text-xl font-bold text-theme-text mb-4 group-hover:text-theme-primary group-hover:underline transition-colors line-clamp-2 leading-snug">
                    {article.title}
                </h3>

                <p className="text-theme-text-muted text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                    {article.contentSnippet || article.content?.substring(0, 200).replace(/<[^>]*>?/gm, '') + '...'}
                </p>

                <div className="flex items-center justify-between text-xs text-theme-text-muted mt-auto pt-2">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 font-medium">
                            <Calendar size={14} />
                            {formattedDate}
                        </span>
                        {article.creator && (
                            <span className="flex items-center gap-1.5 font-medium">
                                <User size={14} />
                                {article.creator}
                            </span>
                        )}
                    </div>
                    <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-theme-primary" />
                </div>
            </div>
        </a>
    );
};
