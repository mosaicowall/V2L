import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "V2L | Professional 24/7 Live Stream Control",
  description: "Cloud-based live streaming dashboard for continuous 24/7 transmission to YouTube and RTMP platforms.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
