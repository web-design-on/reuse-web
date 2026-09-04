import { getConversation } from "./actions/messages";
import MessagesClient from "./messages-client";
import { getCurrentUserId } from "@/lib/auth";

export default async function Home() {
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

  if (errorMessage) return <EmptyState message={errorMessage} />;
  if (!conversation || userId === null) {
    return <EmptyState message="Você ainda não tem conversas sobre itens reutilizados." />;
  }

  return <MessagesClient conversation={conversation} userId={userId} />;
}

function EmptyState({ message }: { message: string }) {
  return (
    <main className="messages-shell">
      <section className="setup-state">
        <div className="brand-mark">R</div>
        <p className="eyebrow">REUSE MESSAGES</p>
        <h1>Suas conversas ficam aqui.</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}
