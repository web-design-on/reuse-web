"use client";

import Script from "next/script";

export default function ChatWidget() {
  return (
    <Script id="wxo-chat" strategy="afterInteractive">
      {`
        async function onChatLoad(instance) {
          await instance.updateLocale("pt-BR");

          instance.on("authTokenNeeded", async function (event) {
            const res = await fetch("./api/chatbot/wxo-token");
            const data = await res.json();
            event.authToken = data.token;
          });
        }

        window.wxOConfiguration = {
          orchestrationID: "0bcc146e9a8242929b5a88eb806767b4_34fb50e9-f88c-45a4-88d9-19b6fa7d3863",
          hostURL: "https://ca-tor.watson-orchestrate.cloud.ibm.com",
          rootElementID: "chat-root",
          deploymentPlatform: "ibmcloud",
          crn: "crn:v1:bluemix:public:watsonx-orchestrate:ca-tor:a/0bcc146e9a8242929b5a88eb806767b4:34fb50e9-f88c-45a4-88d9-19b6fa7d3863::",
          defaultLocale: "pt-BR",
          chatOptions: {
            agentId: "7e96aff9-0b87-49e3-b052-4925f926a4ac",
            onLoad: onChatLoad
          }
        };

        setTimeout(function () {
          const script = document.createElement("script");
          script.src = window.wxOConfiguration.hostURL + "/wxochat/wxoLoader.js?embed=true";
          script.addEventListener("load", function () {
            wxoLoader.init();
          });
          document.head.appendChild(script);
        }, 0);
      `}
    </Script>
  );
}