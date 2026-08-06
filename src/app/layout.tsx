import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppLayout } from "@/components/layout/AppLayout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FORTIVEX.AI CRM",
  description: "Enterprise Admissions & Sales CRM Platform",
  icons: {
    icon: [
      { url: "/images/fortivex-logo.png", type: "image/png" },
    ],
    apple: "/images/fortivex-logo.png",
    shortcut: "/images/fortivex-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
