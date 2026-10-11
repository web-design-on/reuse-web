import { timingSafeEqual } from "node:crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";

export type ErrorCode = "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN";

type ErrorBody = {
    success: false;
    code: ErrorCode;
    message: string;
};

export function errorJson(status: number, code: ErrorCode, message: string) {
    return NextResponse.json<ErrorBody>({ success: false, code, message }, { status });
}

function hasValidExtensionKey(token: string) {
    const expectedToken = process.env.ASSISTANT_EXTENSION_API_KEY ?? process.env.CHATBOT_API_TOKEN;
    if (!expectedToken) return false;

    const received = Buffer.from(token);
    const expected = Buffer.from(expectedToken);
    return received.length === expected.length && timingSafeEqual(received, expected);
}

function getUserIdFromActionToken(token: string) {
    const secret = process.env.ASSISTANT_ACTION_SECRET;
    if (!secret) return null;

    try {
        const payload = jwt.verify(token, secret, { algorithms: ["HS256"] }) as JwtPayload;
        if (payload.purpose !== "reuse-action" || typeof payload.sub !== "string" || !/^[1-9]\d*$/.test(payload.sub)) {
            return null;
        }

        const userId = Number(payload.sub);
        return Number.isSafeInteger(userId) ? userId : null;
    } catch {
        return null;
    }
}

export async function requireUserId(request: Request) {
    const extensionKey = request.headers.get("x-reuse-extension-key");
    const actionToken = request.headers.get("x-reuse-action-token");

    if (extensionKey !== null || actionToken !== null) {
        if (!extensionKey || !actionToken || !hasValidExtensionKey(extensionKey)) return null;
        return getUserIdFromActionToken(actionToken);
    }

    try {
        return await getCurrentUserId();
    } catch {
        return null;
    }
}

export async function readJsonBody(request: Request) {
    try {
        return await request.json();
    } catch {
        return null;
    }
}

export function normalizeLimit(value: unknown, fallback = 20, min = 1, max = 50) {
    const parsed = Number(value ?? fallback);
    if (!Number.isFinite(parsed)) return fallback;
    const integer = Math.trunc(parsed);
    return Math.max(min, Math.min(max, integer));
}

export function normalizeOfferIds(value: unknown) {
    if (!Array.isArray(value)) return null;

    const unique = new Set<number>();
    for (const raw of value) {
        const parsed = Number(raw);
        if (!Number.isInteger(parsed) || parsed <= 0) return null;
        unique.add(parsed);
    }

    return [...unique];
}
