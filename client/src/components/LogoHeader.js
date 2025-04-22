import React from "react";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import logo from "../assets/logo.png";
import { useColorMode } from "@chakra-ui/react";

// Styled components
const MainContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  textAlign: "center",
}));

const LogoContainer = styled("div")(({ theme }) => ({
  marginRight: theme.spacing(1),
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(0),
  },
}));

const LogoImage = styled("img")(({ theme, isMobile }) => ({
  height: isMobile ? "40px" : "80px",
}));

const Title = styled(Typography)(({ theme }) => ({
  letterSpacing: "-0.5px", // Tighter letter spacing
  lineHeight: 1.2,
  background: "linear-gradient(90deg, #000, #333)", // Subtle gradient 's text
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  fontFamily:
    "'TwitterChirp', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontWeight: "bold",
}));

const LogoHeader = ({ forcedColorMode, isMobile }) => {
  const { colorMode } = useColorMode();
  // Use the passed prop or default to the current color mode
  const mode = forcedColorMode || colorMode;

  return (
    <MainContainer>
      <LogoContainer>
        <LogoImage
          src={logo}
          alt="Logo"
          style={{
            filter: mode === "dark" ? "invert(1)" : "none", // Invert only in dark mode
          }}
          isMobile={isMobile}
        />
      </LogoContainer>
      <Title
        variant={isMobile ? "h4" : "h2"}
        component="h1"
        color={mode === "dark" ? "white" : "black"}
      >
        The Linkup
      </Title>
    </MainContainer>
  );
};

export default LogoHeader;
