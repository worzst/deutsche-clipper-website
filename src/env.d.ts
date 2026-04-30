/// <reference types="astro/client" />

interface Window {
  dataLayer: Record<string, unknown>[];
  gtag: (...args: unknown[]) => void;
  turnstile?: {
    reset: (widgetId?: string) => void;
    remove: (widgetId?: string) => void;
  };
}

declare function gtag(...args: unknown[]): void;
