import type { Metadata } from "next";
import { Amiri, Cairo, Cormorant_Garamond, Inter } from "next/font/google";
import { getI18n } from "@/lib/i18n/server";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

// Arabic script: Cairo for text, Amiri (Naskh) for the elegant headings.
const arabicSans = Cairo({ variable: "--font-arabic", subsets: ["arabic"] });
const arabicDisplay = Amiri({ variable: "--font-arabic-display", subsets: ["arabic"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Aromatic Africa",
  description: "Aroma diffusers, fragrance oils and luxury perfumes",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, dir } = await getI18n();
  return (
    <html
      lang={locale}
      dir={dir}
      className={`${display.variable} ${sans.variable} ${arabicSans.variable} ${arabicDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
