import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "V2L | Professional Streaming & Sales Suite",
  description: "High-performance video streaming and subscription-based sales system for DM → Call → Close workflows.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
