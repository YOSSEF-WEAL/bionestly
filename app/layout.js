import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderServer from "./_blocks/HeaderServer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BioNestly",
  description: "BioNestly app for bio links ",
};

export default function RootLayout({ children })
{
  return (
    <html lang="ar" dir="rtl">

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  bg-[#f1f0ee]`}
      >
        <Toaster />
        <HeaderServer />
        <main className="max-w-full md:max-w-[1350px] mx-auto overflow-x-hidden md:overflow-x-visible">
          {children}
        </main>
      </body>
    </html>
  );
}
