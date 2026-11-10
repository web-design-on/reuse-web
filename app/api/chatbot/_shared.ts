import { timingSafeEqual } from "node:crypto";
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

function hasValidChatbotToken(token: string) {
    const expectedToken = process.env.CHATBOT_API_TOKEN;
    if (!expectedToken) return false;

    const received = Buffer.from(token);
    const expected = Buffer.from(expectedToken);
    return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function requireUserId(request: Request) {
    const authorization = request.headers.get("authorization");

    if (authorization !== null) {
        const match = /^Bearer\s+(.+)$/i.exec(authorization);
        if (!match || !hasValidChatbotToken(match[1].trim())) return null;

        const userId = request.headers.get("x-reuse-user-id");
        if (!userId || !/^[1-9]\d*$/.test(userId)) return null;

        const parsedUserId = Number(userId);
        if (!Number.isSafeInteger(parsedUserId)) return null;
        return parsedUserId;
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
