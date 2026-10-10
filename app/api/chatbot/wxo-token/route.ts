import jwt from "jsonwebtoken";
import NodeRSA from "node-rsa";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
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
    name: "Visitante",
    custom_user_id: "",
    sso_token: "sso_token",
  };

  const rsa = new NodeRSA(ibmPublicKey);
  const encryptedPayload = rsa.encrypt(
    Buffer.from(JSON.stringify(userPayload), "utf-8"),
    "base64"
  );

  const token = jwt.sign(
    {
      sub: "id-do-usuario",
      user_payload: encryptedPayload,
      context: { name: "Visitante" },
    },
    privateKey,
    { algorithm: "RS256", expiresIn: "1h" }
  );

  return NextResponse.json({ token });
}