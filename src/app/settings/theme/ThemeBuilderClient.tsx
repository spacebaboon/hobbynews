"use client";

import { useRouter } from "next/navigation";
import { ThemeBuilder } from "@/components/theme/ThemeBuilder";
import { ThemeColors } from "@/components/theme/ThemeProvider";

export function ThemeBuilderClient() {
  const router = useRouter();

  const handleSave = async (customTheme: ThemeColors & { name: string }) => {
    const res = await fetch("/api/user/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customTheme }),
    });

    if (!res.ok) {
      throw new Error("Failed to save theme");
    }
  };

  const handleCancel = () => {
    router.push("/settings");
  };

  return <ThemeBuilder onSave={handleSave} onCancel={handleCancel} />;
}
