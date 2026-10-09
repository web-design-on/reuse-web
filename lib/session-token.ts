import { createHmac, timingSafeEqual } from "node:crypto";

function signUserId(userId: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET deve ter pelo menos 32 caracteres.");
  }

  return createHmac("sha256", secret).update(`reuse-session:${userId}`).digest("hex");
}

export function createUserSessionValue(userId: number) {
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("ID de usuário inválido.");
  }

  const value = String(userId);
  return `${value}.${signUserId(value)}`;
}

export function verifyUserSessionValue(value: string | undefined) {
  const match = /^([1-9]\d*)\.([a-f0-9]{64})$/.exec(value ?? "");
  if (!match) return null;

  const userId = Number(match[1]);
  if (!Number.isSafeInteger(userId)) return null;

  const expected = Buffer.from(signUserId(match[1]), "hex");
  const received = Buffer.from(match[2], "hex");
  return timingSafeEqual(received, expected) ? userId : null;
}