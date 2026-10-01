import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { Footer } from "@/components/ui/Footer";
import { MotionProvider } from "@/components/ui/MotionProvider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "rationale · oncology research",
  description:
    "Uncertainty-aware, evidence-grounded clinical trial matching for lung adenocarcinoma. Open code, open data, open methods. Not for clinical use.",
};

export const viewport: Viewport = {
  themeColor: "#F2F0EC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrains.variable}`}>
      <body>
        <MotionProvider>
          <div className="card">
            <main id="main">{children}</main>
            <Footer />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
