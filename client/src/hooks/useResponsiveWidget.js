import { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";

export const useResponsiveWidget = (mobileBreakpoint = 600) => {
  const [isMobileView, setIsMobileView] = useState(
    window.innerWidth <= mobileBreakpoint
  );
  const [isWidgetVisible, setIsWidgetVisible] = useState(
    window.innerWidth > mobileBreakpoint
  );
  const wasManuallyToggled = useRef(false);

  const toggleWidget = () => {
    wasManuallyToggled.current = true;
    setIsWidgetVisible((prev) => !prev);
  };

  const handleResize = useCallback(
    debounce(() => {
      const isMobile = window.innerWidth <= mobileBreakpoint;
      setIsMobileView(isMobile);
      if (!wasManuallyToggled.current) {
        setIsWidgetVisible(!isMobile);
      }
    }, 100),
    [mobileBreakpoint]
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return {
    isMobileView,
    isWidgetVisible,
    toggleWidget,
  };
};
