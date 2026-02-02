import { createClient } from "./server";

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
  return user;
}
