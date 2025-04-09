import { useCallback } from "react";

// Platform detection helper
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isStandalonePWA = () =>
  window.matchMedia("(display-mode: standalone)").matches;

// Core badge functionality
export const updateAppBadge = async (count) => {
  // iOS PWA (including home screen)
  if (isIOS() && isStandalonePWA()) {
    try {
      // iOS 16.4+ Web App Badge API
      if (window?.webkit?.messageHandlers?.badge) {
        window.webkit.messageHandlers.badge.postMessage(count);
      }
      // Fallback to document title
      document.title = count > 0 ? `(${count}) The Linkup` : "The Linkup";
      return true;
    } catch (error) {
      console.error("iOS badge error:", error);
      return false;
    }
  }

  // Standard Badging API
  if ("setAppBadge" in navigator) {
    try {
      if (count > 0) {
        await navigator.setAppBadge(count);
      } else {
        await navigator.clearAppBadge();
      }
      return true;
    } catch (error) {
      console.error("Badge API error:", error);
      return false;
    }
  }

  // Fallback for browsers without support
  document.title = count > 0 ? `(${count}) The Linkup` : "The Linkup";
  return false;
};

// React hook version
export const useBadge = () => {
  const updateBadge = useCallback(async (count) => {
    const success = await updateAppBadge(count);

    // Fallback to service worker if direct API failed
    if (!success && navigator.serviceWorker) {
      try {
        const sw = await navigator.serviceWorker.ready;
        await sw.active?.postMessage({
          type: count > 0 ? "UPDATE_BADGE" : "CLEAR_BADGE",
          count: count,
        });
      } catch (error) {
        console.error("Service worker badge update failed:", error);
      }
    }
  }, []);

  return { updateBadge };
};
