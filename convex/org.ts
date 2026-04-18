import type { UserIdentity } from "convex/server";
import type { Id } from "./_generated/dataModel";

export function orgIdFromIdentity(identity: UserIdentity): Id<"organizations"> {
  const o = (identity as Record<string, unknown>).orgId;
  if (typeof o !== "string" || !o) {
    throw new Error("Missing orgId on identity; sign in again");
  }
  return o as Id<"organizations">;
}
