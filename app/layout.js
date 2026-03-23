import { Sora, JetBrains_Mono } from "next/font/google";
import AgentationWrapper from "./components/AgentationWrapper";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "CaseForge — Evidence Automation Demo",
  description:
    "Court-proof surveillance reports in seconds. No AI writing, full chain of custody.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable}`}>
      <body>
        {children}
        <AgentationWrapper />
      </body>
    </html>
  );
}
