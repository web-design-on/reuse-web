import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { errorJson, normalizeLimit, readJsonBody, requireUserId } from "../../_shared";

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
    const userId = await requireUserId();
    if (!userId) {
        return errorJson(401, "UNAUTHORIZED", "Faça login para continuar.");
    }

    const body = await readJsonBody(request);
    if (body === null) {
        return errorJson(400, "BAD_REQUEST", "Payload JSON inválido.");
    }

    const limit = normalizeLimit((body as { limit?: unknown }).limit);

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
