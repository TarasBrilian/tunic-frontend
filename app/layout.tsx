import type { Metadata } from "next";
import { DM_Mono, Lora } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

const lora = Lora({
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "Tunic - Beautiful Addresses, Made for You",
  description: "Vanity EVM address generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmMono.variable} ${lora.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
