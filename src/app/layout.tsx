import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Synthetic Data Generator",
  description: "Generate realistic synthetic datasets and download them as CSV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}