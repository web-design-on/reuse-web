import { getConversation } from "../actions/messages";
import MessagesClient from "../messages-client";
import { getCurrentUserId } from "@/lib/auth";

export default async function MessagesPage() {
  let userId: number | null = null;
  let conversation: Awaited<ReturnType<typeof getConversation>> = null;
  let errorMessage: string | null = null;

  try {
    userId = await getCurrentUserId();
    conversation = await getConversation();
  } catch (error) {
    errorMessage = error instanceof Error && error.message === "UNAUTHORIZED"
      ? "Entre na sua conta para acessar suas mensagens."
      : "Configure o banco PostgreSQL para carregar suas conversas.";
  }

  if (errorMessage) {
    return <MessagesClient conversation={demoConversation} userId={1} demo />;
  }
  if (!conversation || userId === null) {
    return <MessagesClient conversation={demoConversation} userId={1} demo />;
  }

  return <MessagesClient conversation={conversation} userId={userId} />;
}

const demoConversation = {
  id: "demo-conversation",
  itemId: null,
  participantTwoId: 2,
  messages: [{
    id: "demo-message",
    text: "Oi",
    imageUrl: null,
    senderId: 1,
    createdAt: new Date().toISOString(),
  }],
};