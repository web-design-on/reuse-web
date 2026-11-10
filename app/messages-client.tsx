"use client";

import { ChangeEvent, FormEvent, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { FaFileUpload } from "react-icons/fa";
import { sendMessage, type MessageContactView, type MessageView } from "./actions/messages";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

const avatars = [
  "/avatars/vendedor_joao.png",
  "/avatars/vendedor_7329.png",
  "/avatars/vendedor_anônimo.png",
  "/avatars/vendedor_maria.png",
  "/avatars/vendedor_1048.png",
];

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export default function MessagesClient({ contacts, userId }: { contacts: MessageContactView[]; userId: number }) {
  const [contactList, setContactList] = useState(contacts);
  const [messageHistory, setMessageHistory] = useState<Record<number, MessageView[]>>(
    Object.fromEntries(contacts.map((contact) => [contact.id, contact.messages])),
  );
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [selectedContactId, setSelectedContactId] = useState<number | null>(contacts[0]?.id ?? null);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const selectedContact = contactList.find((contact) => contact.id === selectedContactId) ?? null;
  const selectedAvatar = avatars[contactList.findIndex((contact) => contact.id === selectedContactId) % avatars.length] ?? avatars[0];
  const normalizedSearch = normalizeSearch(searchTerm);
  const filteredContacts = contactList.filter((contact) => normalizeSearch(contact.userName).includes(normalizedSearch));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if ((!text.trim() && !imageData) || isPending || !selectedContact) return;

    const pendingText = text;
    const pendingImage = imageData;
    const pendingContact = selectedContact;
    setText("");
    setImageData(null);
    setError("");

    startTransition(async () => {
      try {
        const result = await sendMessage({
          conversationId: pendingContact.conversationId,
          recipientId: pendingContact.id,
          text: pendingText,
          imageUrl: pendingImage,
        });

        setMessageHistory((current) => ({
          ...current,
          [pendingContact.id]: [...(current[pendingContact.id] ?? []), result.message],
        }));
        setContactList((current) => current.map((contact) => contact.id === pendingContact.id
          ? { ...contact, conversationId: result.conversationId }
          : contact));
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

  const messages = selectedContactId === null ? [] : messageHistory[selectedContactId] ?? [];

  return (
    <main className="messages-shell">
      <section className="messages-layout" aria-label="Mensagens ReUse">
        <aside className="inbox-sidebar">
          <header className="inbox-header"><strong>Mensagens</strong></header>
          <label className="search-box"><FaSearch aria-hidden="true" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Pesquisar" aria-label="Pesquisar conversas" /></label>
          <div className="inbox-tabs"><strong>Mensagens</strong></div>
          <div className="conversation-list">
            {filteredContacts.map((contact) => (
              <button className={`conversation-item ${selectedContactId === contact.id ? "selected" : ""}`} type="button" key={contact.id} onClick={() => setSelectedContactId(contact.id)}>
                <Image className="person-avatar" src={avatars[contactList.findIndex((item) => item.id === contact.id) % avatars.length]} alt="" width={44} height={44} />
                <span><strong>{contact.userName}</strong></span>
              </button>
            ))}
            {filteredContacts.length === 0 && <p className="search-empty">Nenhum outro usuário encontrado.</p>}
          </div>
        </aside>

        <section className="conversation-card" aria-label={selectedContact ? `Conversa com ${selectedContact.userName}` : "Mensagens"}>
          <header className="conversation-header">
            {selectedContact && <Image className="person-avatar chat-avatar" src={selectedAvatar} alt="" width={48} height={48} />}
            <div className="chat-title"><h1>{selectedContact?.userName ?? "Mensagens"}</h1></div>
          </header>

          <div className="message-list" aria-live="polite">
            {messages.length === 0 ? (
              <div className="empty-chat"><span>✦</span><p>{selectedContact ? "Comece a conversa." : "Não há outros usuários cadastrados."}</p></div>
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
            <button className="camera-button" type="button" onClick={() => fileInput.current?.click()} aria-label="Anexar arquivo" disabled={!selectedContact || isPending}><FaFileUpload /></button>
            <input id="message" value={text} onChange={(event) => setText(event.target.value)} placeholder="Digite uma mensagem..." maxLength={2000} disabled={!selectedContact || isPending} />
            <button className="send-button" type="submit" aria-label="Enviar mensagem" disabled={(!text.trim() && !imageData) || !selectedContact || isPending}>➤</button>
          </form>
          {error && <p className="form-error">{error}</p>}
        </section>
      </section>
    </main>
  );
}
