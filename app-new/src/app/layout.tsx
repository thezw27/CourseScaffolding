import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PageContext from "@/contexts/PageContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Course Scaffold",
  description: "An interactive course planning tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PageContext>
          {children}
        </PageContext>
        </body>
    </html>
  );
}
