import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { CompanyProvider } from "@/components/context/company-context";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hensall CoOp Mockup ERP",
  description: "Modern ERP solution for business management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CompanyProvider>
            {children}
          </CompanyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}