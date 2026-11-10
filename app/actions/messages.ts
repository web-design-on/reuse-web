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

export type MessageContactView = {
  id: number;
  firstName: string;
  userName: string;
  conversationId: string | null;
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

export async function getMessageContacts(): Promise<MessageContactView[]> {
  const userId = await getCurrentUserId();
  const [users, conversations] = await Promise.all([
    db.user.findMany({
      where: { id: { not: userId } },
      select: { id: true, firstName: true, userName: true },
      orderBy: { firstName: "asc" },
    }),
    db.conversation.findMany({
      where: { OR: [{ participantOneId: userId }, { participantTwoId: userId }] },
      include: { messages: { orderBy: { createdAt: "asc" } } },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const conversationsByContact = new Map<number, (typeof conversations)[number]>();
  for (const conversation of conversations) {
    const contactId = conversation.participantOneId === userId
      ? conversation.participantTwoId
      : conversation.participantOneId;
    if (!conversationsByContact.has(contactId)) conversationsByContact.set(contactId, conversation);
  }

  return users.map((user) => {
    const conversation = conversationsByContact.get(user.id);
    return {
      ...user,
      conversationId: conversation?.id ?? null,
      messages: conversation?.messages.map(toView) ?? [],
    };
  });
}

export async function sendMessage(input: { conversationId?: string | null; recipientId: number; text: string; imageUrl?: string | null }) {
  const userId = await getCurrentUserId();
  const text = input.text.trim();

  if ((!text && !input.imageUrl) || text.length > 2000) throw new Error("MESSAGE_INVALID");
  if (!Number.isInteger(input.recipientId) || input.recipientId === userId) throw new Error("RECIPIENT_INVALID");
  if (input.imageUrl && (!input.imageUrl.startsWith("data:image/") || input.imageUrl.length > 3_000_000)) {
    throw new Error("IMAGE_INVALID");
  }

  const recipient = await db.user.findUnique({ where: { id: input.recipientId }, select: { id: true } });
  if (!recipient) throw new Error("RECIPIENT_NOT_FOUND");

  const participants = [
    { participantOneId: userId, participantTwoId: recipient.id },
    { participantOneId: recipient.id, participantTwoId: userId },
  ];
  const conversation = input.conversationId
    ? await db.conversation.findFirst({
        where: {
          id: input.conversationId,
          OR: participants,
        },
        select: { id: true },
      })
    : await db.conversation.findFirst({ where: { OR: participants }, select: { id: true } });

  const activeConversation = conversation ?? await db.conversation.create({
    data: { participantOneId: userId, participantTwoId: recipient.id },
    select: { id: true },
  });

  const message = await db.message.create({
    data: { conversationId: activeConversation.id, senderId: userId, text, imageUrl: input.imageUrl ?? null },
  });

  revalidatePath("/messages");
  return { message: toView(message), conversationId: activeConversation.id };
}