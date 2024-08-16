import React from "react";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import Logo from "../logo.png"; // Import the logo image
import { useColorMode } from "@chakra-ui/react";

// Define styled components
const ErrorContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Center horizontally
  justifyContent: "center", // Center vertically
  minHeight: "100vh", // Ensure the container takes full height of the viewport
  textAlign: "center", // Center text horizontally
});

const LogoImage = styled("img")(({ theme }) => ({
  width: 80,
  marginBottom: 20,
  filter:
    theme.palette.mode === "dark" ? "invert(0.879) grayscale(70%)" : "none",
}));

const ErrorMessage = styled("h1")(({ theme }) => ({
  fontSize: 24,
  color: theme.palette.primary.main,
}));

const ErrorDescription = styled("p")(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

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
  const { colorMode } = useColorMode();

  return (
    <ErrorContainer>
      <LogoImage src={Logo} alt="LUUL Logo" />
      <ErrorMessage>Oops! Something went wrong.</ErrorMessage>
      <ErrorDescription>
        We're sorry, but we couldn't fetch the data from our servers.
      </ErrorDescription>
      <RetryButton variant="contained" onClick={onRetry}>
        Retry
      </RetryButton>
      <ErrorDescription>
        If the problem persists, please contact support.
      </ErrorDescription>
    </ErrorContainer>
  );
};

export default ErrorPage;
