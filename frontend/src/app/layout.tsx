import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWAInstallModal from "@/components/PWAInstallModal";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Engracedsmile - Travel and Logistics",
  description: "Your trusted partner for comfortable and safe travel and logistics across Nigeria. Modern vehicles, experienced drivers, and exceptional service.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Engracedsmile",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#5d4a15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Engracedsmile" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Engracedsmile" />
        <meta name="msapplication-TileColor" content="#5d4a15" />
        <meta name="msapplication-tap-highlight" content="no" />
        <script src="https://js.paystack.co/v1/inline.js" async></script>
        {/* Tawk.to Chat Widget */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/68defdf832ab201957262949/1j6jh056j';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
        {/* Service Worker Registration with Cache Management */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', async function() {
                  try {
                    // First, unregister any existing service workers
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (let registration of registrations) {
                      await registration.unregister();
                      console.log('Old SW unregistered');
                    }
                    
                    // Clear all caches
                    const cacheNames = await caches.keys();
                    for (let cacheName of cacheNames) {
                      await caches.delete(cacheName);
                      console.log('Cache deleted:', cacheName);
                    }
                    
                    // Register new service worker
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('SW registered: ', registration);
                    
                    // Force update check
                    registration.addEventListener('updatefound', () => {
                      const newWorker = registration.installing;
                      if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker available, reload the page
                            console.log('New SW available, reloading...');
                            window.location.reload();
                          }
                        });
                      }
                    });
                  } catch (error) {
                    console.log('SW registration failed: ', error);
                  }
                });
              }
            `,
          }}
        />
      </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthProvider>
            {children}
            <PWAInstallModal />
          </AuthProvider>
        </body>
    </html>
  );
}
