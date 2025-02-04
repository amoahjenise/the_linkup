import React from "react";
import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

// Define the styled component using MUI's styled function
const SpinnerContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%", // Center vertically within the container
  width: "100%", // Center horizontally within the container
}));

const LoadingSpinner = ({ marginTop = "0px" }) => {
  return (
    <SpinnerContainer style={{ marginTop }}>
      <CircularProgress size={48} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
