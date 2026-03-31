import type { Metadata } from "next";
import { Rajdhani, Orbitron } from "next/font/google";
import "./globals.css";
import DashboardSidebar from "@/components/Layout/DashboardSidebar";
import Navbar from "@/components/Layout/Navbar";
import MainWrapper from "@/components/Layout/MainWrapper";
import { Providers } from "@/components/providers";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import PageTransition from "@/components/PageTransition";
import FullScreenLoader from "@/components/FullScreenLoader";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "CATALYST | Mastery Through Action",
  description: "AI-driven Interactive Simulation Platform for practical skill development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${rajdhani.variable} ${orbitron.variable} font-sans antialiased bg-[#dceaf9] text-slate-800 selection:bg-blue-200 min-h-screen`}>
          {/* Background Grid for the entire app */}
          <div className="fixed inset-0 z-0 pointer-events-none light-grid-bg opacity-30" />

          <ClerkLoading>
            <FullScreenLoader />
          </ClerkLoading>
          <Providers>
            <DashboardSidebar />
            <Navbar />
            <MainWrapper>
              <PageTransition>
                {children}
              </PageTransition>
            </MainWrapper>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
