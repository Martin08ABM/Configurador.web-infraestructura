import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infraestructura | Martin Bravo",
  description: "Developed by Martin Bravo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Syne:wght@400..800&display=swap" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}