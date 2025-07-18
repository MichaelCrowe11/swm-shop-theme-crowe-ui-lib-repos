import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crowe Logic™ - Myco-Intelligent Commerce",
  description: "The intelligent interface layer for Southwest Mushrooms, Crowe Mycology, and Crowe Logic AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-crowe-dark text-crowe-text">
          <Sidebar />
          <main className="lg:ml-sidebar">
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
