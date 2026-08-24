import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ARCHON Session Labs",
  description: "Secure Telegram session workflow interface",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
