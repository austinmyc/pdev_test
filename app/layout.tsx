import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Time Value of Money - Interactive Learning",
  description: "An interactive teaching tool for understanding the Time Value of Money concept in finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-gray-900 text-gray-100">
        {children}
      </body>
    </html>
  );
}
