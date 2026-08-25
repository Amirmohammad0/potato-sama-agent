import "./globals.css";

export const metadata = {
  title: "Kali Web Terminal",
  description: "Browser Linux terminal powered by Vercel Sandbox",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
