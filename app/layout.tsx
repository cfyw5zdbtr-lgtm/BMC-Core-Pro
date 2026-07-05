import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BMC Core Pro — Site Manager Tool",
  description: "A lightweight personal alternative to Procore.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
