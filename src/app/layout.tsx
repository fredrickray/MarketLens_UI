import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../index.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "MarketLens AI",
  description: "AI-powered stock analysis and market insights",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
