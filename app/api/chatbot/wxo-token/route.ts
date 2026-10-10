import jwt from "jsonwebtoken";
import NodeRSA from "node-rsa";
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
  const ibmPublicKeyEnv = process.env.WXO_IBM_PUBLIC_KEY;

  if (!privateKeyEnv || !ibmPublicKeyEnv) {
    return NextResponse.json(
      { error: "Faltam WXO_JWT_PRIVATE_KEY ou WXO_IBM_PUBLIC_KEY no .env.local" },
      { status: 500 }
    );
  }

  const privateKey = privateKeyEnv.replace(/\\n/g, "\n");
  const ibmPublicKey = ibmPublicKeyEnv.replace(/\\n/g, "\n");

  const userPayload = {
    name: user.firstName,
    custom_user_id: String(user.id),
  };

  const rsa = new NodeRSA(ibmPublicKey);
  const encryptedPayload = rsa.encrypt(
    Buffer.from(JSON.stringify(userPayload), "utf-8"),
    "base64"
  );

  const token = jwt.sign(
    {
      sub: String(user.id),
      user_payload: encryptedPayload,
      context: { name: user.firstName },
    },
    privateKey,
    { algorithm: "RS256", expiresIn: "1h" }
  );

  return NextResponse.json({ token });
}