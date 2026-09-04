"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth";

export type MessageView = {
  id: string;
  text: string;
  imageUrl: string | null;
  senderId: number;
  createdAt: string;
};

export type ConversationView = {
  id: string;
  itemId: number | null;
  participantTwoId: number;
  messages: MessageView[];
};

function toView(message: {
  id: string;
  text: string;
  imageUrl: string | null;
  senderId: number;
  createdAt: Date;
}): MessageView {
  return { ...message, createdAt: message.createdAt.toISOString() };
}

export async function getConversation(conversationId?: string): Promise<ConversationView | null> {
  const userId = await getCurrentUserId();
  const conversation = await db.conversation.findFirst({
    where: conversationId
      ? { id: conversationId, OR: [{ participantOneId: userId }, { participantTwoId: userId }] }
      : { OR: [{ participantOneId: userId }, { participantTwoId: userId }] },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!conversation) return null;

  return {
    id: conversation.id,
    itemId: conversation.itemId,
    participantTwoId: conversation.participantOneId === userId
      ? conversation.participantTwoId
      : conversation.participantOneId,
    messages: conversation.messages.map(toView),
  };
}

export async function sendMessage(input: { conversationId: string; text: string; imageUrl?: string | null }) {
  const userId = await getCurrentUserId();
  const text = input.text.trim();

  if ((!text && !input.imageUrl) || text.length > 2000) throw new Error("MESSAGE_INVALID");
  if (input.imageUrl && (!input.imageUrl.startsWith("data:image/") || input.imageUrl.length > 3_000_000)) {
    throw new Error("IMAGE_INVALID");
  }

  const conversation = await db.conversation.findFirst({
    where: {
      id: input.conversationId,
      OR: [{ participantOneId: userId }, { participantTwoId: userId }],
    },
    select: { id: true },
  });

  if (!conversation) throw new Error("CONVERSATION_NOT_FOUND");

  const message = await db.message.create({
    data: { conversationId: conversation.id, senderId: userId, text, imageUrl: input.imageUrl ?? null },
  });

  revalidatePath("/");
  return toView(message);
}