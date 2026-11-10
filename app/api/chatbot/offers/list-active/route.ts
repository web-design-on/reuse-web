import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { errorJson, normalizeLimit, requireUserId } from "../../_shared";

type OfferItem = {
    id: number;
    title: string;
    price: number;
    status: "ACTIVE" | "PAUSED";
};

type SuccessBody = {
    success: true;
    total: number;
    offers: OfferItem[];
};

export async function POST(request: Request) {
    const userId = await requireUserId(request);
    if (!userId) {
        return errorJson(401, "UNAUTHORIZED", "Faça login para continuar.");
    }

    let body: { limit?: unknown };
    try {
        const text = await request.text();
        body = text.trim() ? JSON.parse(text) : {};
        if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    } catch {
        return errorJson(400, "BAD_REQUEST", "Payload JSON inválido.");
    }

    const limit = normalizeLimit(body.limit);

    const offers = await db.product.findMany({
        where: {
            ownerId: userId,
            status: "ACTIVE",
        },
        orderBy: { id: "desc" },
        take: limit,
        select: {
            id: true,
            title: true,
            price: true,
            status: true,
        },
    });

    return NextResponse.json<SuccessBody>({
        success: true,
        total: offers.length,
        offers,
    });
}
