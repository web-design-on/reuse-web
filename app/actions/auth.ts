"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const USER_COOKIE = "reuse_user_id";

async function setSessionCookie(userId: number) {
  (await cookies()).set(USER_COOKIE, String(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

function toSafeUser(user: { id: number; firstName: string; userName: string; image: string | null }) {
  return { id: user.id, firstName: user.firstName, userName: user.userName, image: user.image ?? undefined };
}

export async function registerUser(firstName: string, userName: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { firstName: firstName.trim(), userName: userName.trim(), password: hashedPassword },
    });

    await setSessionCookie(user.id);
    return toSafeUser(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Esse nome de usuário já existe. Tente outro.");
    }
    throw error;
  }
}

export async function authenticateUser(userName: string, password: string) {
  const user = await db.user.findUnique({ where: { userName: userName.trim() } });
  const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !passwordMatches) {
    throw new Error("Usuário ou senha inválidos.");
  }

  await setSessionCookie(user.id);
  return toSafeUser(user);
}

export async function signOutUser() {
  (await cookies()).delete(USER_COOKIE);
}
