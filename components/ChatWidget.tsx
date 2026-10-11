"use client";

import Script from "next/script";

export default function ChatWidget() {
  return (
    <Script id="assistant-builder-web-chat" strategy="afterInteractive">
      {`
        (async function () {
          try {
            const integrationID = ${JSON.stringify(process.env.NEXT_PUBLIC_IBM_ASSISTANT_INTEGRATION_ID ?? "")};
            const region = ${JSON.stringify(process.env.NEXT_PUBLIC_IBM_ASSISTANT_REGION ?? "")};
            const serviceInstanceID = ${JSON.stringify(process.env.NEXT_PUBLIC_IBM_ASSISTANT_SERVICE_INSTANCE_ID ?? "")};
            const clientVersion = ${JSON.stringify(process.env.NEXT_PUBLIC_IBM_ASSISTANT_WEB_CHAT_VERSION || "latest")};

            if (!integrationID || !region || !serviceInstanceID) {
              throw new Error("Configure os IDs do Web Chat IBM nas variáveis NEXT_PUBLIC_IBM_ASSISTANT_*.");
            }

            const res = await fetch("/api/assistant/session", {
              method: "POST",
              credentials: "same-origin",
              cache: "no-store"
            });
            if (!res.ok) {
              throw new Error("Não foi possível obter a identidade autenticada do chat.");
            }

            const data = await res.json();
            if (typeof data.identityToken !== "string" || !data.identityToken) {
              throw new Error("A resposta da identidade do chat é inválida.");
            }

            window.watsonAssistantChatOptions = {
              integrationID,
              region,
              serviceInstanceID,
              clientVersion,
              identityToken: data.identityToken,
              onLoad: async function (instance) {
                await instance.updateLocale("pt-BR");
                await instance.render();
              }
            };

            const script = document.createElement("script");
            script.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + clientVersion + "/WatsonAssistantChatEntry.js";
            script.async = true;
            document.head.appendChild(script);
          } catch (error) {
            console.error("[assistant-web-chat] Falha ao inicializar o Web Chat seguro.", error);
          }
        })();
      `}
    </Script>
  );
}
