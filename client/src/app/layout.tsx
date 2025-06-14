import type { Metadata } from "next";
import "@/styles/reset.css";


export const metadata: Metadata = {
  title: "Sboard app",
  description: "Empty description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
