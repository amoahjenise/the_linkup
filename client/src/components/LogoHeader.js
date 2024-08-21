import React from "react";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import logo from "../assets/logo.png";

// Styled components
const MainContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  textAlign: "center",
}));

const LogoContainer = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(4),
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
  return (
    <MainContainer>
      {/* Uncomment this to include the logo */}
      {/* <LogoContainer>
        <LogoImage src={logo} alt="Logo" />
      </LogoContainer> */}
      <Title variant="h4" component="h1">
        LINK-UP
      </Title>
    </MainContainer>
  );
};

export default LogoHeader;
