import { createPublicKey } from "node:crypto";
import jwt from "jsonwebtoken";
import NodeRSA from "node-rsa";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export const runtime = "nodejs";

function decodeIbmPublicKey(value: string) {
  const decoded = Buffer.from(value, "base64");
  const decodedText = decoded.toString("utf8");
  const key = decodedText.includes("-----BEGIN")
    ? createPublicKey(decodedText)
    : createPublicKey({ key: decoded, format: "der", type: "spki" });

  return key.export({ type: "spki", format: "pem" }).toString();
}

export async function POST() {
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

  const privateKeyBase64 = process.env.ASSISTANT_WEB_CHAT_PRIVATE_KEY_BASE64;
  const ibmPublicKeyBase64 = process.env.ASSISTANT_WEB_CHAT_IBM_PUBLIC_KEY_BASE64;
  const privateKeyEnv = process.env.WXO_JWT_PRIVATE_KEY;
  const ibmPublicKeyEnv = process.env.WXO_IBM_PUBLIC_KEY;
  const actionSecret = process.env.ASSISTANT_ACTION_SECRET;

  if ((!privateKeyBase64 && !privateKeyEnv) || (!ibmPublicKeyBase64 && !ibmPublicKeyEnv) || !actionSecret) {
    return NextResponse.json(
      { error: "Configure as chaves do Web Chat e ASSISTANT_ACTION_SECRET na Vercel." },
      { status: 500 }
    );
  }

  const privateKey = privateKeyBase64
    ? Buffer.from(privateKeyBase64, "base64").toString("utf8")
    : privateKeyEnv!.replace(/\\n/g, "\n");
  const ibmPublicKey = ibmPublicKeyBase64
    ? decodeIbmPublicKey(ibmPublicKeyBase64)
    : ibmPublicKeyEnv!.replace(/\\n/g, "\n");
  const actionTokenExpiresAt = Math.floor(Date.now() / 1000) + 10 * 60;
  const actionToken = jwt.sign(
    { sub: String(user.id), purpose: "reuse-action" },
    actionSecret,
    { algorithm: "HS256", expiresIn: "10m" }
  );
  const encryptedPayload = new NodeRSA(ibmPublicKey).encrypt(
    Buffer.from(JSON.stringify({ reuse_action_token: actionToken }), "utf8"),
    "base64"
  );

  const identityToken = jwt.sign(
    {
      sub: String(user.id),
      user_payload: encryptedPayload,
      context: {
        reuse_authenticated: true,
        reuse_token_expires_at: new Date(actionTokenExpiresAt * 1000).toISOString(),
        reuse_user_name: user.firstName,
      },
    },
    privateKey,
    { algorithm: "RS256", expiresIn: "10m" }
  );

  return NextResponse.json(
    { identityToken },
    { headers: { "Cache-Control": "no-store" } }
  );
}