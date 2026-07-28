import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Is there a vaccine for that?",
  description: "Plain-language status on outbreaks and vaccines, in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="max-w-xl mx-auto px-5 mt-6 text-xs text-ink-soft">
          <p>Prototype built for exploration and research purposes.</p>
        </footer>
      </body>
    </html>
  );
}
