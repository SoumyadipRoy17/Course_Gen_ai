import { Geist, Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Provider } from "@/components/Providers";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata = {
  title: "Course Gen AI",
  description: "Generates course",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn(lexend.className, "antialiased min-h-screen pt-16")}>
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
