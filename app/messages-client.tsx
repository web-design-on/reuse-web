"use client";

import { FormEvent, useState, useTransition } from "react";
import Image from "next/image";
import { sendMessage, type ConversationView, type MessageView } from "./actions/messages";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default function MessagesClient({ conversation, userId }: { conversation: ConversationView; userId: number }) {
  const [messages, setMessages] = useState(conversation.messages);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim() || isPending) return;
    const pendingText = text;
    setText("");
    setError("");

    startTransition(async () => {
      try {
        const message = await sendMessage({ conversationId: conversation.id, text: pendingText });
        setMessages((current) => [...current, message]);
      } catch {
        setText(pendingText);
        setError("Não foi possível enviar agora. Tente novamente.");
      }
    });
  }

  return (
    <main className="messages-shell">
      <section className="conversation-card" aria-label="Conversa sobre reutilização de item">
        <header className="conversation-header">
          <div className="avatar" aria-hidden="true">R</div>
          <div>
            <p className="eyebrow">CONVERSA DE REUTILIZAÇÃO</p>
            <h1>Troca de item</h1>
            <p className="status"><span /> Participante #{conversation.participantTwoId}</p>
          </div>
          <span className="item-tag">Item #{conversation.itemId ?? "pendente"}</span>
        </header>

        <div className="message-list" aria-live="polite">
          {messages.length === 0 ? (
            <div className="empty-chat"><span>✦</span><p>Comece a conversa sobre este item.</p></div>
          ) : messages.map((message: MessageView) => {
            const own = message.senderId === userId;
            return (
              <div className={`message-row ${own ? "own" : "received"}`} key={message.id}>
                <div className="bubble">
                  {message.text && <p>{message.text}</p>}
                  {message.imageUrl && <Image src={message.imageUrl} alt="Imagem enviada na conversa" width={320} height={240} unoptimized />}
                  <time>{formatTime(message.createdAt)}</time>
                </div>
              </div>
            );
          })}
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="message">Digite uma mensagem</label>
          <input id="message" value={text} onChange={(event) => setText(event.target.value)} placeholder="Digite uma mensagem..." maxLength={2000} disabled={isPending} />
          <button type="submit" aria-label="Enviar mensagem" disabled={!text.trim() || isPending}>➤</button>
        </form>
        {error && <p className="form-error">{error}</p>}
      </section>
    </main>
  );
}