import type { Metadata } from "next";
import "./globals.css";
import { WithData } from "@/components/WithData";

export const metadata: Metadata = {
  title: "TranSwitch",
  description: "Change buses comfortably",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="min-h-full bg-zinc-200" lang="en">
      <body>
        <div className="h-[100vh] max-w-[70vh] mx-auto p-4 bg-zinc-100 shadow-md">
          <WithData>{children}</WithData>
        </div>
      </body>
    </html>
  );
}
