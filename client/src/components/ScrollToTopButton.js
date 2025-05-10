import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { ArrowUpward } from "@mui/icons-material";

const ScrollToTopButton = ({ onClick, colorMode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    let resizeTimeout;

    const updateDeviceMode = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsLandscape(window.matchMedia("(orientation: landscape)").matches);
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDeviceMode, 150);
    };

    updateDeviceMode();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", updateDeviceMode);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", updateDeviceMode);
    };
  }, []);

  let topPosition = "90%"; // default for large screens
  if (isMobile) {
    topPosition = isLandscape ? "68%" : "83%";
  }

  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "sticky",
        top: topPosition,
        left: "50%",
        zIndex: 1000,
        transform: "translateX(-50%)",
        color: colorMode === "dark" ? "white" : "black",
        backgroundColor:
          colorMode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        "&:hover": {
          backgroundColor:
            colorMode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
        },
        borderRadius: "50%",
        p: 1.5,
      }}
    >
      <ArrowUpward />
    </IconButton>
  );
};

export default ScrollToTopButton;
