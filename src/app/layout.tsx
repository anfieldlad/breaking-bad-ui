import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Breaking B.A.D. - Laboratory",
  description: "Advanced chemical data processing and intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-bad-black`}>
        <Navbar />
        <main className="pt-24 min-h-screen relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-bad-green/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-bad-blue/10 blur-[120px] rounded-full" />

          <div className="relative z-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
