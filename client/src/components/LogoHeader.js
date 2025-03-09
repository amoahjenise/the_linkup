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

const LogoHeader = () => {
  const { colorMode } = useColorMode();

  return (
    <MainContainer>
      <LogoContainer>
        <LogoImage
          src={logo}
          alt="Logo"
          style={{
            filter: colorMode === "dark" ? "invert(1)" : "none", // Invert only in dark mode
          }}
        />
      </LogoContainer>
      <Title
        variant="h4"
        component="h1"
        color={colorMode === "dark" ? "white" : "black"}
      >
        The Linkup
      </Title>
    </MainContainer>
  );
};

export default LogoHeader;
