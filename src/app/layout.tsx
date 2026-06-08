import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sidekick Partner Portal",
  description: "Your branded print and promotional products, all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
