import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";

import { Sidebar } from "@/components/Sidebar";
import { contactsForUser } from "@/lib/data";
import { getSignedInKey, USERS } from "@/lib/session";

import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif" });

export const metadata: Metadata = {
  title: { default: "Stoop", template: "%s | Stoop" },
  description: "Stoop, a demo real-estate CRM with Rollout's Embedded Apps Marketplace.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const key = await getSignedInKey();
  const user = USERS[key];

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <div className="shell">
          <Sidebar
            contactCount={contactsForUser(user).length}
            user={{ key, name: user.name, initials: user.initials, title: user.title }}
          />
          <div className="main">{children}</div>
        </div>
      </body>
    </html>
  );
}
