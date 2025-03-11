import React from "react";
import { Button, styled, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const FloatingButton = styled(Button)(({ theme }) => ({
  position: "fixed", // Use fixed positioning to keep the button in place
  top: "11%", // Adjust this value to place the button at the desired vertical position
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1100,
  minWidth: "auto",
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  background:
    "linear-gradient(120deg, rgba(0, 121, 107, 0.25), rgba(150, 190, 220, 0.25))",
  color: "#fff",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(120deg, #004D40, rgba(120, 160, 190, 1))",
    transform: "translateX(-50%) translateY(-5px)",
  },
  "&:active": {
    transform: "translateX(-50%) translateY(0)",
  },
  "&:focus": {
    outline: "none",
    boxShadow: "0 0 0 3px rgba(0, 123, 107, 0.5)",
  },
}));

const NewLinkupButton = ({ onClick }) => {
  return (
    <Tooltip title="Update Feed" arrow placement="bottom">
      <FloatingButton
        variant="contained"
        onClick={onClick}
        aria-label="Update Feed"
      >
        <RefreshIcon />
      </FloatingButton>
    </Tooltip>
  );
};

export default NewLinkupButton;
