import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { localeMeta } from "@/i18n/config";
import { I18nProvider } from "@/i18n/provider";
import { getDictionary, getLocale } from "@/i18n/server";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary();

  return {
    metadataBase: siteUrl,
    title: t.meta.title,
    description: t.meta.description,
    keywords: [
      "desenvolvedor Campina Grande do Sul",
      "desenvolvedor Quatro Barras",
      "desenvolvimento de software Paraná",
      "sistemas web sob medida",
      "Automação de processos",
      "Integração de sistemas",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: "/",
      siteName: "Null Development",
      type: "website",
      locale: localeMeta[locale].ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/circular.png", type: "image/png", sizes: "48x48" },
        { url: "/circular.svg", type: "image/svg+xml" },
      ],
      apple: "/circular.png",
      shortcut: "/circular.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dictionary = await getDictionary();

  return (
    <html
      lang={localeMeta[locale].htmlLang}
      className={cn(
        "dark font-sans scroll-smooth",
        inter.variable,
        geistMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <I18nProvider locale={locale} dictionary={dictionary}>
          {children}
        </I18nProvider>
        <Toaster duration={2000} richColors closeButton={true} />
        <Analytics />
      </body>
    </html>
  );
}
