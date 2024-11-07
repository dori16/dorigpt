import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DoriGPT",
  description: "Your AI Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={inter.className}>{children}</body>
    </html>
  );
} 