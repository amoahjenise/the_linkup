import React from "react";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

// Define styled components
const ErrorContainer = styled("div")(({ theme, colorMode }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderRadius: "8px", // Subtle rounded corners for the whole container
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow
  maxWidth: "calc(100vw - 80px)", // Adjust width to account for the left menu (assuming it's 80px wide)
  minHeight: "100dvh",
  alignItems: "center", // Center horizontally
  justifyContent: "center", // Center vertically
  textAlign: "center", // Center text horizontally
  flex: 2,
  overflowY: "auto", // Enables vertical scrolling if content overflows
  borderRightWidth: "1px",
  borderRightColor: colorMode === "dark" ? "#2D3748" : "#D3D3D3", // Border color based on theme
  marginLeft: "80px", // Adjust for the left menu width
  [theme.breakpoints.down("sm")]: {
    flex: 1, // Adjust flex for smaller screens
    marginLeft: 0, // Remove left margin on smaller screens
  },
}));

const ErrorMessage = styled("h1")(({ theme }) => ({
  fontSize: 24,
}));

const ErrorDescription = styled("p")(({ theme }) => ({}));

const RetryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: 20,
  padding: "10px 20px",
  marginTop: 20,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ErrorPage = ({ onRetry }) => {
  return (
    <ErrorContainer>
      <ErrorMessage>Oops! Something went wrong.</ErrorMessage>
      <ErrorDescription>
        We're sorry, but we couldn't fetch the data from our servers.
      </ErrorDescription>
      <ErrorDescription>
        If the problem persists, please contact support.
      </ErrorDescription>
    </ErrorContainer>
  );
};

export default ErrorPage;
