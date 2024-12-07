'use client';

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Suspense, useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ToastProvider } from "@/lib/hooks/useToast";

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <ToastProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <ClientOnly>
              {children}
            </ClientOnly>
          </Suspense>
        </ToastProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
} 