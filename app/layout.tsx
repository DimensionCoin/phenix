// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PhenixWallet",
  description: "best solana wallet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        {/* Link to the web app manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        {/* Meta tags for theme color and mobile app capabilities */}
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* Application name and titles for iOS */}
        <meta name="phenix wallet" content="PhenixWallet" />
        <meta name="phenix" content="PhenixWallet" />

        {/* Style of the status bar for iOS */}
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* Icons for the app, particularly for iOS */}
        <link rel="apple-touch-icon" href="/phenixlogo.png" />

        {/* Fallback icons and favicon for non-iOS devices */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />

        {/* Splash screens for iOS */}
        {/* Example for iPhone X, Xs, 11 Pro */}
        <link
          href="/splashscreens/iphone-x-xs-11-pro.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
          rel="apple-touch-startup-image"
        />

        {/* Example for iPhone 8, 7, 6s, 6 */}
        <link
          href="/splashscreens/iphone-8-7-6s-6.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
      </Head>

      <body className={`${inter.className}`}>
        <UserProvider>
          <div className="min-h-screen">{children}</div>
        </UserProvider>
      </body>
    </html>
  );
}
