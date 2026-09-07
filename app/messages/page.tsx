import { redirect } from "next/navigation";
import { getConversation } from "../actions/messages";
import MessagesClient from "../messages-client";
import { getCurrentUserId } from "@/lib/auth";

export default async function MessagesPage() {
  let userId: number;

  try {
    userId = await getCurrentUserId();
  } catch {
    redirect("/login");
  }

  const conversation = await getConversation();
  if (!conversation) {
    return <MessagesClient conversation={emptyConversation} userId={userId} />;
  }

  return <MessagesClient conversation={conversation} userId={userId} />;
}

const emptyConversation = {
  id: "empty-conversation",
  itemId: null,
  participantTwoId: 0,
  messages: [],
};