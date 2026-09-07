import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";
import Navbar from "./navbar";
import Providers from "./providers";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mensagens | ReUse",
  description: "Converse sobre itens reutilizados.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isLoggedIn = Boolean((await cookies()).get("reuse_user_id")?.value);

  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body>
        <Providers>
          <Navbar isLoggedIn={isLoggedIn} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
