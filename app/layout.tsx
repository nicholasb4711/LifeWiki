import { ThemeProvider } from "next-themes";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { NavBar } from "@/components/nav-bar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "LifeWiki - Your Personal Knowledge Base",
  description: "Organize and manage your life's important information in one secure place",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-primary/5 via-primary/5 to-transparent">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <NavBar />
              <div className="flex flex-col gap-20 max-w-7xl p-5 w-full ">
                {children}
              </div>

              <footer className="w-full border-t py-6 text-center text-sm text-muted-foreground">
                <p>
                  © {new Date().getFullYear()} LifeWiki. All rights reserved.
                </p>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

