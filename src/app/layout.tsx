import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PreferencesProvider } from "@/components/PreferencesProvider";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yuri Araujo — Interactive Web & Creative Computing",
  description:
    "Personal website and interactive playground of Yuri Araujo. Explore Sound Lab, FreeCell, Math Gallery, and live browser sketches.",
  metadataBase: new URL("https://yuriaraujo.dev.br"),
  openGraph: {
    title: "Yuri Araujo",
    description:
      "Building interactive things for the web — sound synthesis, classic games, and visual mathematics.",
    url: "https://yuriaraujo.dev.br",
    siteName: "Yuri Araujo",
    type: "website",
  },
};

const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem('ya-theme');
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
