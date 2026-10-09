import { cookies } from "next/headers";
import { verifyUserSessionValue } from "@/lib/session-token";

const USER_COOKIE = "reuse_user_id";

export async function getCurrentUserId() {
  const value = (await cookies()).get(USER_COOKIE)?.value;
  const userId = verifyUserSessionValue(value);

  if (userId === null) {
    throw new Error("UNAUTHORIZED");
  }

  return userId;
}