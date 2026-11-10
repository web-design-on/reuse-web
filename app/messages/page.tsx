import { redirect } from "next/navigation";
import { getMessageContacts } from "../actions/messages";
import MessagesClient from "../messages-client";
import { getCurrentUserId } from "@/lib/auth";

export default async function MessagesPage() {
  let userId: number;

  try {
    userId = await getCurrentUserId();
  } catch {
    redirect("/login");
  }

  const contacts = await getMessageContacts();
  return <MessagesClient contacts={contacts} userId={userId} />;
}