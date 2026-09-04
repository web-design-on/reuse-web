"use client";

import { ChangeEvent, FormEvent, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { FaFileUpload } from "react-icons/fa";
import { sendMessage, type ConversationView, type MessageView } from "./actions/messages";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

const sellers = [
  { name: "vendedor_joão", avatar: "/avatars/vendedor_joao.png" },
  { name: "vendedor_7329", avatar: "/avatars/vendedor_7329.png" },
  { name: "vendedor_anônimo", avatar: "/avatars/vendedor_anônimo.png" },
  { name: "vendedor_maria", avatar: "/avatars/vendedor_maria.png" },
  { name: "vendedor_1048", avatar: "/avatars/vendedor_1048.png" },
];

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export default function MessagesClient({ conversation, userId, demo = false }: { conversation: ConversationView; userId: number; demo?: boolean }) {
  const [messageHistory, setMessageHistory] = useState<Record<string, MessageView[]>>({
    vendedor_joão: conversation.messages,
    vendedor_7329: [],
    vendedor_anônimo: [],
    vendedor_maria: [],
    vendedor_1048: [],
  });
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [selectedSeller, setSelectedSeller] = useState("vendedor_joão");
  const [searchTerm, setSearchTerm] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const selectedAvatar = sellers.find((seller) => seller.name === selectedSeller)?.avatar ?? sellers[0].avatar;
  const normalizedSearch = normalizeSearch(searchTerm);
  const filteredSellers = sellers.filter((seller) => normalizeSearch(seller.name).includes(normalizedSearch));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if ((!text.trim() && !imageData) || isPending) return;

    const pendingText = text;
    const pendingImage = imageData;
    setText("");
    setImageData(null);
    setError("");

    startTransition(async () => {
      try {
        const message: MessageView = demo
          ? {
              id: `demo-${Date.now()}`,
              text: pendingText,
              imageUrl: pendingImage,
              senderId: userId,
              createdAt: new Date().toISOString(),
            }
          : await sendMessage({ conversationId: conversation.id, text: pendingText, imageUrl: pendingImage });

        setMessageHistory((current) => ({
          ...current,
          [selectedSeller]: [...(current[selectedSeller] ?? []), message],
        }));
      } catch {
        setText(pendingText);
        setImageData(pendingImage);
        setError("Não foi possível enviar agora. Tente novamente.");
      }
    });
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Escolha uma imagem de até 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageData(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  const messages = messageHistory[selectedSeller] ?? [];

  return (
    <main className="messages-shell">
      <section className="messages-layout" aria-label="Mensagens ReUse">
        <aside className="inbox-sidebar">
          <header className="inbox-header"><strong>meu_usuario</strong></header>
          <label className="search-box"><FaSearch aria-hidden="true" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Pesquisar" aria-label="Pesquisar conversas" /></label>
          <div className="inbox-tabs"><strong>Mensagens</strong></div>
          <div className="conversation-list">
            {filteredSellers.map((seller) => (
              <button className={`conversation-item ${selectedSeller === seller.name ? "selected" : ""}`} type="button" key={seller.name} onClick={() => setSelectedSeller(seller.name)}>
                <Image className="person-avatar" src={seller.avatar} alt="" width={44} height={44} />
                <span><strong>{seller.name}</strong></span>
              </button>
            ))}
            {filteredSellers.length === 0 && <p className="search-empty">Nenhuma conversa encontrada.</p>}
          </div>
        </aside>

        <section className="conversation-card" aria-label={`Conversa com ${selectedSeller}`}>
          <header className="conversation-header">
            <Image className="person-avatar chat-avatar" src={selectedAvatar} alt="" width={48} height={48} />
            <div className="chat-title"><h1>{selectedSeller}</h1></div>
          </header>

          <div className="message-list" aria-live="polite">
            {messages.length === 0 ? (
              <div className="empty-chat"><span>✦</span><p>Comece a conversa sobre este item.</p></div>
            ) : messages.map((message) => {
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

          {imageData && <div className="image-preview"><Image src={imageData} alt="Imagem selecionada" width={70} height={54} unoptimized /><button type="button" onClick={() => setImageData(null)} aria-label="Remover imagem">×</button></div>}
          <form className="composer" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="message">Digite uma mensagem</label>
            <input ref={fileInput} className="sr-only" type="file" accept="image/*" onChange={handleImageChange} />
            <button className="camera-button" type="button" onClick={() => fileInput.current?.click()} aria-label="Anexar arquivo"><FaFileUpload /></button>
            <input id="message" value={text} onChange={(event) => setText(event.target.value)} placeholder="Digite uma mensagem..." maxLength={2000} disabled={isPending} />
            <button className="send-button" type="submit" aria-label="Enviar mensagem" disabled={(!text.trim() && !imageData) || isPending}>➤</button>
          </form>
          {error && <p className="form-error">{error}</p>}
        </section>
      </section>
    </main>
  );
}
