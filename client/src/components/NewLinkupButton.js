import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => ({
  position: "fixed",
  top: "9.5%", // Adjusted position to place the button above the first linkup item
  left: "47%",
  transform: "translateX(-50%)",
  zIndex: 3000,
  padding: "5px 10px",
  fontSize: "12px",
  borderRadius: "20px",
  background: "linear-gradient(120deg, #00796B, rgba(150, 190, 220, 1))", // Using 'background' for gradient
  color: "#fff",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, background 0.3s ease", // Add transition for smooth animation
  "&:hover": {
    background: "linear-gradient(120deg, #004D40, rgba(120, 160, 190, 1))", // Adjust hover effect
    transform: "translateX(-50%) translateY(-5px)", // Slide up effect
  },
}));

const NewLinkupButton = ({ onClick }) => {
  return (
    <StyledButton variant="contained" onClick={onClick}>
      New Linkups
    </StyledButton>
  );
};

export default NewLinkupButton;
