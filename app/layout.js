import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderServer from "./_blocks/HeaderServer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "تطبيق نكست",
  description: "تم الإنشاء بواسطة Create Next App",
};

export default function RootLayout({ children })
{
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <HeaderServer />
        {children}
      </body>
    </html>
  );
}
