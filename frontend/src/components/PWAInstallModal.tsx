"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Smartphone, 
  Wifi, 
  Bell, 
  Shield, 
  X,
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallModal() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as Navigator & { standalone?: boolean }).standalone === true) {
        setIsInstalled(true);
        return;
      }
      setIsInstalled(false);
    };

    checkIfInstalled();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show modal after a delay to not be too aggressive
      setTimeout(() => {
        if (!isInstalled) {
          setShowModal(true);
        }
      }, 3000);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowModal(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    
    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error during installation:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleManualInstall = () => {
    setShowModal(false);
    // Show instructions for manual installation
    alert('To install this app:\n\n1. Look for the "Add to Home Screen" option in your browser menu\n2. Or tap the share button and select "Add to Home Screen"\n3. Follow the prompts to install the app');
  };

  if (isInstalled) {
    return null;
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#5d4a15] rounded-lg flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg">Install Engracedsmile App</DialogTitle>
                <DialogDescription className="text-sm">
                  Get the full mobile experience
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowModal(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Benefits */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Offline Access</span>
              </div>
              <p className="text-xs text-gray-600">View bookings without internet</p>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Push Notifications</span>
              </div>
              <p className="text-xs text-gray-600">Get booking updates instantly</p>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Secure</span>
              </div>
              <p className="text-xs text-gray-600">Your data is always safe</p>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Fast</span>
              </div>
              <p className="text-xs text-gray-600">Lightning quick loading</p>
            </Card>
          </div>

          {/* Features List */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">What you can do:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Book travel tickets instantly
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Track your shipments in real-time
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Manage your bookings and payments
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Get instant notifications
              </div>
            </div>
          </div>

          {/* Install Buttons */}
          <div className="space-y-2">
            {deferredPrompt ? (
              <Button 
                onClick={handleInstall}
                disabled={isInstalling}
                className="w-full bg-[#5d4a15] hover:bg-[#6b5618] text-white"
              >
                {isInstalling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Install App
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleManualInstall}
                className="w-full bg-[#5d4a15] hover:bg-[#6b5618] text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => setShowModal(false)}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span>4.8 • 1,200+ downloads</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
