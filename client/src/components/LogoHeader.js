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

const LogoImage = styled("img")({
  height: "40px",
});

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
}));

const LogoHeader = ({ forcedColorMode }) => {
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
        />
      </LogoContainer>
      <Title
        variant="h4"
        component="h1"
        color={mode === "dark" ? "white" : "black"}
      >
        The Linkup
      </Title>
    </MainContainer>
  );
};

export default LogoHeader;
