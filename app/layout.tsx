import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://untrod.in"),
  title: {
    default: "untrod.in — Drive every road around you",
    template: "%s · untrod.in",
  },
  description:
    "Aimless rides, tracked. untrod.in plans short round-trip loops over roads you haven't ridden yet — for cycle, bike, motorcycle and car. Take a lap, clear your head.",
  applicationName: "untrod.in",
  keywords: [
    "explore", "ride tracker", "round trip", "loop routes",
    "cycling", "motorcycle", "drive", "OpenStreetMap", "India",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "untrod.in",
    title: "untrod.in — Drive every road around you",
    description:
      "Short round-trip loops over roads you haven't ridden yet. Take a lap, clear your head.",
    url: "https://untrod.in",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "untrod.in — Drive every road around you",
    description:
      "Short round-trip loops over roads you haven't ridden yet.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FAF9F6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
