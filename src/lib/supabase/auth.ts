import { createClient } from "./server";
import { prisma } from "@/lib/prisma";

/**
 * Get the current authenticated user from a server context.
 * Returns null if not authenticated.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Require authentication. Throws if not authenticated.
 * Use in API routes / server actions that need a user.
 */
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Ensure a User row exists in the database
  await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email!,
      name: user.user_metadata?.full_name || null,
      avatarUrl: user.user_metadata?.avatar_url || null,
    },
    create: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || null,
      avatarUrl: user.user_metadata?.avatar_url || null,
    },
  });

  return user;
}
