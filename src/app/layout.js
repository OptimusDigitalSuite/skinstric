import { Inter } from "next/font/google";
import "./globals.css";

// Roobert (the Figma's face) is a paid trial font, so Inter is the loaded
// stand-in; globals.css still names Roobert first if it's ever installed.
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "600"], variable: "--font-inter" });

export const metadata = {
  title: "Skinstric",
  description: "Sophisticated skincare, analysed from a photo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
