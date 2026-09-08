"use client";


const categoryIcons = {
  Roupas: "👗",
  Eletrônicos: "📱",
  Móveis: "🛋️",
  Calçados: "👟",
  Acessórios: "👜",
  Livros: "📚",
  Esportes: "⚽",
};

export default function HomePage() {
  return (
    <div className="bg-[#F8F7FF]">
      <section className="bg-[#5B50E8] relative overflow-hidden  mb-12">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 70% 50%, #A8D900 0%, transparent 55%), radial-gradient(circle at 5% 80%, #3730b8 0%, transparent 40%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#A8D900] animate-pulse" />
              Mais de 1200 itens disponíveis hoje
            </div>
            <p className="text-5xl fs-21 lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
              Compre menos.
              <br />
              <span className="text-[#A8D900]">Viva mais.</span>
            </p>
            <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-lg">
              Encontre itens incríveis de segunda mão com preços que fazem
              sentido — e ainda ajuda o planeta no processo.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-4 sm:mx-6 lg:mx-8 mb-12 max-w-7xl lg:mx-auto lg:px-8">
        <div className="bg-[#1C1B2E] rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 90% 50%, #A8D900 0%, transparent 50%)",
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-[#A8D900]/20 text-[#A8D900] text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
              🌱 Impacto ambiental
            </div>
            <h3 className="text-3xl lg:text-4xl font-extrabold text-white mb-3 leading-tight">
              Cada compra importa
              <br />
              <span className="text-[#A8D900]">para o planeta.</span>
            </h3>
            <p className="text-white/60 max-w-md leading-relaxed">
              Juntos, nossa comunidade já economizou mais de 840 toneladas de
              CO₂. Você faz parte dessa mudança toda vez que escolhe o ReUse.
            </p>
          </div>
          <div className="relative flex-shrink-0 grid grid-cols-2 gap-4 w-full lg:w-auto">
            {[
              { icon: "♻️", value: "580t", label: "CO₂ economizado" },
              { icon: "💧", value: "2.3M L", label: "Água poupada" },
              { icon: "👕", value: "400", label: "Peças reaproveitadas" },
              { icon: "🌳", value: "670", label: "Árvores equivalentes" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <p className="text-xl font-extrabold text-[#A8D900]">
                  {stat.value}
                </p>
                <p className="text-white/50 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-[#EAE8FD] rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[#1C1B2E] mb-2">
                Pronto para vender também?
              </h3>
              <p className="text-gray-500 text-sm">
                Cadastre-se grátis e comece a ganhar com o que você não usa
                mais.
              </p>
            </div>
            <button
              onClick={() => window.location.href = "/register"}
              className="flex-shrink-0 px-8 py-3.5 rounded-xl bg-[#5B50E8] text-white font-bold hover:bg-[#4a40d4] transition-colors"
            >
              Criar conta grátis
            </button>
          </div>
        </section>
    </div>
  );
}