import ModalProvider from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord 2",
  description: "A discord server for everyone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338] ")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme">
            <SocketProvider>
              <QueryProvider>{children}</QueryProvider>
              {/* {children} */}
              <ModalProvider />
            </SocketProvider>

            {/* {children}
            <ModalProvider /> */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
