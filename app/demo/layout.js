import { DM_Mono, Libre_Baskerville } from "next/font/google";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "CaseForge — Dashboard Demo",
  description: "PI Report Automation Dashboard",
};

export default function DemoLayout({ children }) {
  return (
    <div className={`${dmMono.variable} ${libreBaskerville.variable}`}>
      {children}
    </div>
  );
}
