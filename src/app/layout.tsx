import type { Metadata } from "next";
import { Inter, Geist, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";

/* ============================================================
   Root Layout — Nexus Journal
   Sets up fonts, metadata, theme provider, and base HTML structure.
   ============================================================ */

// ---------- Font Configuration ----------

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// ---------- Site Metadata ----------

export const metadata: Metadata = {
  title: {
    default: "Nexus Journal — A Living Map of Thoughts",
    template: "%s | Nexus Journal",
  },
  description:
    "An explorable digital knowledge universe — personal blog reimagined as an interactive constellation of ideas, projects, and discoveries.",
  keywords: [
    "blog",
    "knowledge graph",
    "digital garden",
    "AI",
    "software engineering",
    "interactive portfolio",
  ],
  authors: [{ name: "Nexus" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nexus Journal",
    title: "Nexus Journal — A Living Map of Thoughts",
    description:
      "Explore a digital knowledge universe where every idea is a node in a living system.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Journal",
    description:
      "A living map of thoughts, projects, ideas and discoveries.",
  },
};

// ---------- Theme Script (prevents FOUC) ----------

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('nexus-theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch(e) {}
  })();
`;

// ---------- Root Layout Component ----------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
