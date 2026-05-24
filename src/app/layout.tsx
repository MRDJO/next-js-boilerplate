import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald, Rubik } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const rubik = Rubik({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300","400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nextjs Boilerplate",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${rubik.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
