"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, Mail, Download } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isInstallable, isInstalled, isInstalling, install, showInstallInstructions } = usePWAInstall();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Routes", href: "/routes" },
    { name: "Trips", href: "/trips" },
    { name: "Logistics", href: "/logistics" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleDownloadApp = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        showInstallInstructions();
      }
    } else {
      showInstallInstructions();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Top bar */}
      <div className="bg-[#5d4a15] text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+2348071116229</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>info@engracedsmile.com</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Free cancellations up to 24 hours before departure</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Engracedsmile Logo"
                  width={80}
                  height={80}
                  className="object-contain cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-[#5d4a15] transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isInstalled && (
              <button
                onClick={handleDownloadApp}
                disabled={isInstalling}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isInstalling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download App
                  </>
                )}
              </button>
            )}
            <Link 
              href="/contact" 
              className="bg-[#5d4a15] text-white px-4 py-2 rounded-md hover:bg-[#6b5618] transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#5d4a15] hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 pb-2 space-y-2">
                {!isInstalled && (
                  <button
                    onClick={handleDownloadApp}
                    disabled={isInstalling}
                    className="block w-full bg-green-600 text-white px-3 py-2 text-center rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isInstalling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto mb-1"></div>
                        Installing...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mx-auto mb-1" />
                        Download App
                      </>
                    )}
                  </button>
                )}
                <Link 
                  href="/contact" 
                  className="block w-full bg-[#5d4a15] text-white px-3 py-2 text-center rounded-md hover:bg-[#6b5618] transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
