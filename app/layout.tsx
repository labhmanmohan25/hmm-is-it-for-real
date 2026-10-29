import type { Metadata, Viewport } from "next";
import { Bungee, Galada, Outfit, Yatra_One } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { wedding } from "./wedding";
import "./globals.css";

const bungee = Bungee({ variable: "--font-truck", weight: "400", subsets: ["latin"] });
// Truck-art display face (letters only — digits/punctuation fall back to Bungee)
const lotus = localFont({ src: "./fonts/bharat-lotus.woff2", variable: "--font-lotus", display: "swap" });
const yatra = Yatra_One({ variable: "--font-hindi", weight: "400", subsets: ["devanagari", "latin"] });
const galada = Galada({ variable: "--font-bangla", weight: "400", subsets: ["bengali", "latin"] });
const outfit = Outfit({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${wedding.bride.name} weds ${wedding.groom.name} · शुभ विवाह · শুভ বিবাহ`,
  description: `A Bihari groom and a Bengali bride. Join us on ${wedding.dateLabel}. ${wedding.hashtag}`,
};

export const viewport: Viewport = {
  themeColor: "#0d0a0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bungee.variable} ${lotus.variable} ${yatra.variable} ${galada.variable} ${outfit.variable}`}
    >
      <body>
        {/* Lets CSS pre-hide hero pieces until their entrance animation runs (no flash) */}
        <Script id="js-flag" strategy="beforeInteractive">
          {"document.documentElement.classList.add('js')"}
        </Script>
        {children}
      </body>
    </html>
  );
}
