import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { ArrowUpward } from "@mui/icons-material";
import { keyframes } from "@emotion/react";

// Subtle floating animation
const floating = keyframes`
  0% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-3px); }
  100% { transform: translateX(-50%) translateY(0); }
`;

const ScrollToTopButton = ({ onClick, colorMode, $visible }) => {
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

  // Don't render the button if not visible
  if (!$visible) return null;

  let topPosition = "90%";
  if (isMobile) {
    topPosition = isLandscape ? "68%" : "82.5%";
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
        color:
          colorMode === "dark" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
        backgroundColor:
          colorMode === "dark" ? "rgba(28,28,30,0.5)" : "rgba(242,242,247,0.5)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderRadius: "50%",
        padding: "14px",
        boxShadow: `0px 4px 30px ${
          colorMode === "dark" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"
        }, inset 0px 0px 0px 0.5px ${
          colorMode === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,255,255,0.3)"
        }`,
        border: "1px solid",
        borderColor:
          colorMode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
        transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
        animation: `${floating} 3s ease-in-out infinite`,

        // Liquid glass effect
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "50%",
          background:
            colorMode === "dark"
              ? "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)"
              : "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
          zIndex: -1,
        },

        "&:hover": {
          backgroundColor:
            colorMode === "dark"
              ? "rgba(44,44,46,0.7)"
              : "rgba(252,252,255,0.7)",
          boxShadow: `0px 8px 40px ${
            colorMode === "dark" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.15)"
          }, inset 0px 0px 0px 0.5px ${
            colorMode === "dark"
              ? "rgba(255,255,255,0.2)"
              : "rgba(255,255,255,0.4)"
          }`,
          transform: "translateX(-50%) scale(1.05)",
        },

        "&:active": {
          transform: "translateX(-50%) scale(0.95)",
          backgroundColor:
            colorMode === "dark"
              ? "rgba(58,58,60,0.8)"
              : "rgba(230,230,235,0.8)",
        },

        "& .MuiSvgIcon-root": {
          transition: "transform 0.3s ease",
        },

        "&:hover .MuiSvgIcon-root": {
          transform: "scale(1.1)",
        },
      }}
    >
      <ArrowUpward sx={{ fontSize: "1.5rem" }} />
    </IconButton>
  );
};

export default ScrollToTopButton;
