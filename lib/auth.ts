import { cookies } from "next/headers";

const USER_COOKIE = "reuse_user_id";

export async function getCurrentUserId() {
  const value = (await cookies()).get(USER_COOKIE)?.value;
  const userId = Number(value);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("UNAUTHORIZED");
  }

  return userId;
}