"use client";

import Script from "next/script";

export default function ChatWidget() {
  return (
    <Script id="wxo-chat" strategy="afterInteractive">
      {`
        async function fetchAuthToken() {
          const res = await fetch("/api/chatbot/wxo-token", { credentials: "same-origin" });
          if (!res.ok) {
            throw new Error("Não foi possível obter o token do assistente.");
          }

          const data = await res.json();
          if (typeof data.token !== "string" || !data.token) {
            throw new Error("A resposta do token do assistente é inválida.");
          }

          return data.token;
        }

        async function onChatLoad(instance) {
          await instance.updateLocale("pt-BR");

          instance.on("authTokenNeeded", async function (event) {
            event.authToken = await fetchAuthToken();
          });
        }

        const configuration = {
          orchestrationID: "0bcc146e9a8242929b5a88eb806767b4_34fb50e9-f88c-45a4-88d9-19b6fa7d3863",
          hostURL: "https://ca-tor.watson-orchestrate.cloud.ibm.com",
          rootElementID: "chat-root",
          deploymentPlatform: "ibmcloud",
          crn: "crn:v1:bluemix:public:watsonx-orchestrate:ca-tor:a/0bcc146e9a8242929b5a88eb806767b4:34fb50e9-f88c-45a4-88d9-19b6fa7d3863::",
          defaultLocale: "pt-BR",
          chatOptions: {
              agentId: "7e96aff9-0b87-49e3-b052-4925f926a4ac", 
              agentEnvironmentId: "afcc57b2-c30c-4216-aa69-1839165cd861",
              onLoad: onChatLoad
          }
        };

        (async function () {
          try {
            configuration.token = await fetchAuthToken();

            const script = document.createElement("script");
            script.src = configuration.hostURL + "/wxochat/wxoLoader.js?embed=true";
            script.addEventListener("load", function () {
              wxoLoader.init(configuration);
            }, { once: true });
            document.head.appendChild(script);
          } catch (error) {
            console.error("[wxo-chat] Falha ao inicializar o chat seguro.", error);
          }
        })();
      `}
    </Script>
  );
}
