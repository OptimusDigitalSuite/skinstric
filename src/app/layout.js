import "./globals.css";

export const metadata = {
  title: "Skinstric",
  description: "Sophisticated skincare, analysed from a photo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
