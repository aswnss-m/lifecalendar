import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: [ "latin" ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: [ "latin" ],
});

export const metadata: Metadata = {
  title: "Custom Life Calendar",
  description: "Minimalist wallpapers for mindful living. Visualize your life progress or year at a glance.",
  icons: [
    {
      media: "(prefers-color-scheme: dark)",
      url: "/favicon_light.ico",
      href: "/favicon_light.ico",
    },
    {
      media: "(prefers-color-scheme: light)",
      url: "/favicon_dark.ico",
      href: "/favicon_dark.ico",
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex flex-col grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
