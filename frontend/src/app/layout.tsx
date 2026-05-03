import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Timetable Scheduler",
  description: "School course scheduling and management system",
};

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" richColors closeButton duration={3000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
