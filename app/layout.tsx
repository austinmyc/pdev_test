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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
