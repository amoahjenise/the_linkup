import { useCallback } from "react";

export const updateAppBadge = async (count) => {
  if (!("setAppBadge" in navigator)) return false;

  try {
    if (count > 0) {
      await navigator.setAppBadge(count);
    } else {
      await navigator.clearAppBadge();
    }
    return true;
  } catch (error) {
    console.error("Badge update failed:", error);
    return false;
  }
};

export const useBadge = () => {
  const updateBadge = useCallback(async (count) => {
    const success = await updateAppBadge(count);

    if (!success && navigator.serviceWorker) {
      const sw = await navigator.serviceWorker.ready;
      sw.active?.postMessage({
        type: count > 0 ? "UPDATE_BADGE" : "CLEAR_BADGE",
        count: count,
      });
    }
  }, []);

  return { updateBadge };
};
