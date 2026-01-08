import "./globals.css";
import AppShell from "./AppShell";

export const metadata = {
  title: "The English Raj",
  description: "English communication platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
