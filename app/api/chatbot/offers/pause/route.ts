import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { errorJson, normalizeOfferIds, readJsonBody, requireUserId } from "../../_shared";

type SuccessBody = {
    success: true;
    pausedCount: number;
    pausedOfferIds: number[];
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

    const pauseAll = Boolean((body as { pauseAll?: unknown }).pauseAll);
    const rawOfferIds = (body as { offerIds?: unknown }).offerIds;

    let targetOfferIds: number[] = [];

    if (pauseAll) {
        const activeOffers = await db.product.findMany({
            where: {
                ownerId: userId,
                status: "ACTIVE",
            },
            select: { id: true },
        });

        targetOfferIds = activeOffers.map((offer: { id: number }) => offer.id);
    } else {
        const normalizedIds = normalizeOfferIds(rawOfferIds);
        if (!normalizedIds || normalizedIds.length === 0) {
            return errorJson(400, "BAD_REQUEST", "Envie pauseAll=true ou uma lista válida em offerIds.");
        }

        const ownedActiveOffers = await db.product.findMany({
            where: {
                id: { in: normalizedIds },
                ownerId: userId,
                status: "ACTIVE",
            },
            select: { id: true },
        });

        if (ownedActiveOffers.length !== normalizedIds.length) {
            return errorJson(403, "FORBIDDEN", "Uma ou mais ofertas não pertencem ao usuário ou não estão ativas.");
        }

        targetOfferIds = ownedActiveOffers.map((offer: { id: number }) => offer.id);
    }

    if (targetOfferIds.length > 0) {
        await db.product.updateMany({
            where: {
                id: { in: targetOfferIds },
                ownerId: userId,
                status: "ACTIVE",
            },
            data: {
                status: "PAUSED",
            },
        });
    }

    return NextResponse.json<SuccessBody>({
        success: true,
        pausedCount: targetOfferIds.length,
        pausedOfferIds: targetOfferIds,
    });
}
