import type { Metadata } from "next";
import "./globals.css";
import { AccountProvider } from "@/lib/store";
import Nav from "@/components/Nav";
import DevModeBanner from "@/components/DevModeBanner";

export const metadata: Metadata = {
  title: "ContentFlow AI — Saiba o que postar, todos os dias",
  description: "Transforme sua experiência e sua história em um plano de conteúdo pronto pra gravar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AccountProvider>
          <DevModeBanner />
          <Nav />
          <main className="flex-1">{children}</main>
        </AccountProvider>
      </body>
    </html>
  );
}
