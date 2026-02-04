import { Rss, ExternalLink } from "lucide-react";
import { SubscribeButton } from "./SubscribeButton";

interface FeedCardProps {
  id: string;
  name: string;
  description: string | null;
  siteUrl: string | null;
  subscriberCount: number;
  isSubscribed: boolean;
  isLoggedIn: boolean;
}

export function FeedCard({
  id,
  name,
  description,
  siteUrl,
  subscriberCount,
  isSubscribed,
  isLoggedIn,
}: FeedCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-lg flex-shrink-0">
            <Rss size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
            {siteUrl && (
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-blue-500 flex items-center gap-1"
              >
                <ExternalLink size={10} />
                {new URL(siteUrl).hostname}
              </a>
            )}
          </div>
        </div>
      </div>
      {description && (
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      )}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-xs text-gray-400">
          {subscriberCount} {subscriberCount === 1 ? "subscriber" : "subscribers"}
        </span>
        <SubscribeButton
          feedId={id}
          initialSubscribed={isSubscribed}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}
