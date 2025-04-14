import React from "react";
import { Button, styled, Tooltip, keyframes } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const subtleBounce = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0); }
`;

const FloatingButton = styled(Button)(({ colorMode, isloading }) => ({
  position: "sticky",
  top: "5%",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1100,
  minWidth: "auto",
  width: "100px",
  height: "32px",
  borderRadius: "9999px",
  backgroundColor: "rgba(0, 151, 167, 0.3)",
  color: "#FFFFFF",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(0, 151, 167, 0.3)",
  padding: 0,
  transition: "all 0.15s ease-out",
  opacity: 0.9,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "& svg": {
    fontSize: "16px",
    transition: "all 0.2s ease",
    animation: isloading ? `${subtleBounce} 1s infinite` : "none",
  },

  "&:hover": {
    backgroundColor: "rgba(0, 151, 167, 0.5)",
    color: "#FFFFFF",
    borderColor: "rgba(0, 151, 167, 0.5)",
    opacity: 1,
    transform: "translateX(-50%) scale(1.08)",
    boxShadow: "0 2px 8px rgba(0, 151, 167, 0.3)",
  },

  "&:active": {
    transform: "translateX(-50%) scale(0.95)",
  },
}));

const NewLinkupButton = ({ onClick, colorMode, isLoading = false }) => {
  return (
    <Tooltip
      title="Show new updates"
      arrow
      placement="bottom"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: (theme) =>
              colorMode === "dark" ? "rgb(47, 51, 54)" : "rgb(15, 20, 25)",
            color: (theme) =>
              colorMode === "dark"
                ? "rgb(231, 233, 234)"
                : "rgb(255, 255, 255)",
            fontSize: "12px",
            fontWeight: 400,
            padding: "4px 8px",
            borderRadius: "6px",
            boxShadow: (theme) => theme.shadows[2],
            "& .MuiTooltip-arrow": {
              color: (theme) =>
                colorMode === "dark" ? "rgb(47, 51, 54)" : "rgb(15, 20, 25)",
            },
          },
        },
      }}
    >
      <FloatingButton
        onClick={onClick}
        aria-label="Show new updates"
        isloading={isLoading ? 1 : 0}
        disableRipple
        colorMode={colorMode}
      >
        <RefreshIcon
          sx={{
            fontSize: "16px",
            color: "inherit",
          }}
        />
      </FloatingButton>
    </Tooltip>
  );
};

export default NewLinkupButton;
