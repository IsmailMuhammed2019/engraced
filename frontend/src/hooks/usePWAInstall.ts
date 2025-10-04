"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

export function usePWAInstall() {
  const [state, setState] = useState<PWAInstallState>({
    isInstallable: false,
    isInstalled: false,
    isInstalling: false,
    deferredPrompt: null,
  });

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      
      return isStandalone || isIOSStandalone;
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      
      setState(prev => ({
        ...prev,
        isInstallable: true,
        deferredPrompt: promptEvent,
      }));
    };

    const handleAppInstalled = () => {
      setState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        deferredPrompt: null,
      }));
    };

    // Check initial installation status
    setState(prev => ({
      ...prev,
      isInstalled: checkIfInstalled(),
    }));

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!state.deferredPrompt) {
      return false;
    }

    setState(prev => ({ ...prev, isInstalling: true }));

    try {
      await state.deferredPrompt.prompt();
      const { outcome } = await state.deferredPrompt.userChoice;
      
      setState(prev => ({
        ...prev,
        isInstalling: false,
        isInstallable: outcome === 'dismissed',
        deferredPrompt: outcome === 'accepted' ? null : prev.deferredPrompt,
      }));

      return outcome === 'accepted';
    } catch (error) {
      console.error('PWA installation failed:', error);
      setState(prev => ({ ...prev, isInstalling: false }));
      return false;
    }
  };

  const showInstallInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = '';

    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      instructions = `To install this app on iOS:
1. Tap the Share button (square with arrow up)
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to confirm`;
    } else if (userAgent.includes('android')) {
      instructions = `To install this app on Android:
1. Tap the menu button (three dots)
2. Select "Add to Home screen" or "Install app"
3. Tap "Add" or "Install" to confirm`;
    } else {
      instructions = `To install this app:
1. Look for the install icon in your browser's address bar
2. Or check the browser menu for "Install" or "Add to Home Screen"
3. Follow the prompts to install`;
    }

    alert(instructions);
  };

  return {
    ...state,
    install,
    showInstallInstructions,
  };
}
