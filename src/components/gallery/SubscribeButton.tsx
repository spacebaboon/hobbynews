"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";

interface SubscribeButtonProps {
  feedId: string;
  initialSubscribed: boolean;
  isLoggedIn: boolean;
}

export function SubscribeButton({
  feedId,
  initialSubscribed,
  isLoggedIn,
}: SubscribeButtonProps) {
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribed(data.subscribed);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <span className="text-xs text-gray-400 italic">Log in to subscribe</span>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
        subscribed
          ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {subscribed ? <Check size={14} /> : <Plus size={14} />}
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
