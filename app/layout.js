import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import  Header  from "@/components/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Medigo | AI-Powered Digital Healthcare",
  description:
    "Medigo is a modern digital healthcare platform that enables secure doctor consultations, instant bookings, and intelligent health insights.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#2563EB", // blue-600
          colorBackground: "#0F172A", // slate-900
          colorText: "#FFFFFF",
          colorTextSecondary: "#94A3B8",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} font-sans bg-slate-950 text-white antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {/* Subtle background glow */}
            <div className="fixed inset-0 -z-10 bg-slate-950">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-3xl rounded-full" />
            </div>

            <Header />

            <main className="min-h-screen">
              {children}
            </main>

            <Toaster
              richColors
              toastOptions={{
                className: "bg-slate-900 border border-slate-800 text-white",
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
