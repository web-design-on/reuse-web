import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  let userId: number;
  try {
    userId = await getCurrentUserId();
  } catch {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, firstName: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 401 });
  }

  const privateKeyEnv = process.env.WXO_JWT_PRIVATE_KEY;

  if (!privateKeyEnv) {
    return NextResponse.json(
      { error: "Falta WXO_JWT_PRIVATE_KEY no .env.local" },
      { status: 500 }
    );
  }

  const privateKey = privateKeyEnv.replace(/\\n/g, "\n");

  const token = jwt.sign(
    {
      sub: String(user.id),
      context: { name: user.firstName, user_id: String(user.id) },
    },
    privateKey,
    { algorithm: "RS256", expiresIn: "1h" }
  );

  return NextResponse.json({ token });
}