import { FeedCard } from "./FeedCard";

interface Feed {
  id: string;
  name: string;
  description: string | null;
  siteUrl: string | null;
  _count: { subscribers: number };
}

interface TopicSectionProps {
  name: string;
  description: string | null;
  feeds: Feed[];
  subscribedFeedIds: Set<string>;
  isLoggedIn: boolean;
}

export function TopicSection({
  name,
  description,
  feeds,
  subscribedFeedIds,
  isLoggedIn,
}: TopicSectionProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">{name}</h2>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {feeds.map((feed) => (
          <FeedCard
            key={feed.id}
            id={feed.id}
            name={feed.name}
            description={feed.description}
            siteUrl={feed.siteUrl}
            subscriberCount={feed._count.subscribers}
            isSubscribed={subscribedFeedIds.has(feed.id)}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
    </section>
  );
}
