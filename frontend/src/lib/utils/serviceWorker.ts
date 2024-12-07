declare global {
  interface Window {
    workbox: any;
  }
}

export function registerServiceWorker() {
  if (
    typeof window !== 'undefined' && 
    'serviceWorker' in navigator
  ) {
    // Register the service worker
    if (process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }
}

// Function to check if app can be installed
export function isPWAInstallable(): boolean {
  if (typeof window === 'undefined') return false;
  
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isInWebAppiOS = (window.navigator as any).standalone === true;
  const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches;
  
  return !isStandalone && !isInWebAppiOS && !isInWebAppChrome;
}

// Function to prompt PWA installation
export function promptPWAInstall() {
  if (typeof window === 'undefined') return;
  
  let deferredPrompt: any;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
  });
  
  // Show the prompt
  if (deferredPrompt) {
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA prompt');
      }
      deferredPrompt = null;
    });
  }
} 