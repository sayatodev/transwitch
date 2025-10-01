import type { Metadata } from "next";
import "./globals.css";
import { WithData } from "@/components/WithData";
import type { EtaDb } from "hk-bus-eta";

export const metadata: Metadata = {
  title: "TranSwitch",
  description: "Change buses comfortably",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  "use server";

  try {
    const etaDb: EtaDb = await fetch(
      "https://data.hkbus.app/routeFareList.min.json",
      {
        cache: "no-store",
      }
    )
      .then((r) => r.json())
      .catch(() => {
        throw new Error("Failed to load bus route/fare database");
      });

    return (
      <html className="min-h-full bg-zinc-200" lang="en">
        <body>
          <div className="min-h-[100vh] max-w-[70vh] mx-auto p-4 bg-zinc-100 shadow-md">
            <WithData etaDb={etaDb}>{children}</WithData>
          </div>
        </body>
      </html>
    );
  } catch (e) {
    return (
      <html className="min-h-full bg-zinc-200" lang="en">
        <body>
          <div className="min-h-[100vh] max-w-[70vh] mx-auto p-4 bg-zinc-100 shadow-md">
            <div className="text-gray-800">
              Failed to initialize bus route/fare database. Please try again
              later.
            </div>
          </div>
        </body>
      </html>
    );
  }
}
