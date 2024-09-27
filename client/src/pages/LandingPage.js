import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import logoSrc from "../assets/logo.png";
import LandingPageImage from "../assets/LandingPageImage.png";
import Banner from "../assets/Banner3.jpg";
import AppDarkMode from "../assets/AppDarkMode.png";
import AppLightMode from "../assets/AppLightMode.png";

// Styled Components
const PageContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  background: `url(${Banner}) no-repeat center center fixed`,
  backgroundSize: "cover",
  padding: "20px",
});

const Logo = styled("img")({
  width: "30px",
  height: "30px",
  marginRight: "10px",
  filter: "invert(1)", // White logo
});

// Shared button styles to avoid repetition
const buttonStyles = {
  textTransform: "none",
  padding: "10px 20px",
  borderRadius: "30px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
};

const StyledButton = styled(Button)(({ theme }) => ({
  ...buttonStyles,
  backgroundColor: "#FFFFFF",
  color: "#00796B",
  "&:hover": {
    backgroundColor: "#FFEBEE",
    transform: "scale(1.05)", // Lift effect on hover
  },
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  ...buttonStyles,
  color: "#FFFFFF",
  borderColor: "#FFFFFF",
  "&:hover": {
    borderColor: "#FFEBEE",
    color: "#FFEBEE",
    transform: "scale(1.05)", // Lift effect on hover
  },
}));

const ResponsiveImage = styled("img")(({ theme }) => ({
  maxHeight: "570px",
  width: "auto",
  maxWidth: "100%",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.08)",
  },
}));

const ContentContainer = styled("main")(({ theme }) => ({
  display: "flex",
  flex: 1,
  padding: theme.spacing(4),
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  backgroundColor: "transparent",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 80px)",
  },
}));

const Title = styled("h1")(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: "#FFFFFF",
  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
  [theme.breakpoints.up("sm")]: {
    fontSize: "3rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "4rem",
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#FFFFFF",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.3rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.6rem",
  },
}));

const Footer = styled("footer")(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
  borderTop: "1px solid #e0e0e0",
  color: "#FFFFFF",
  backgroundColor: "transparent",
}));

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { colorMode } = useColorMode(); // Use Chakra UI's colorMode

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageContainer>
      <ContentContainer>
        <LeftColumn>
          <Title>The Linkup</Title>
          <LeftSubsectionContainer>
            <LeftSubsection>
              <Subtitle>
                Connect with new people and organize meetups around your
                interests.
              </Subtitle>
              <Typography
                variant="subtitle2"
                component="small"
                sx={{ marginTop: 2, color: "#FFFFFF" }}
              >
                By signing up, you agree to the{" "}
                <a href="/terms-of-service" style={{ color: "#7bbda2" }}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" style={{ color: "#7bbda2" }}>
                  Privacy Policy
                </a>
                , including{" "}
                <a href="/cookie-use" style={{ color: "#7bbda2" }}>
                  Cookie Use
                </a>
                .
              </Typography>
            </LeftSubsection>
          </LeftSubsectionContainer>
          <div style={{ marginTop: "20px" }}>
            <StyledButton
              variant="contained"
              size="large"
              onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </StyledButton>
            <OutlinedButton
              variant="outlined"
              size="large"
              onClick={() => navigate("/sign-in")}
            >
              Log In
            </OutlinedButton>
          </div>
        </LeftColumn>

        <RightColumn>
          <ResponsiveImage
            src={colorMode === "dark" ? AppDarkMode : AppLightMode}
            alt="App Mode"
          />
        </RightColumn>
      </ContentContainer>

      <Footer>
        <Logo src={logoSrc} alt="The Linkup Logo" />
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} The Linkup. All rights reserved.
        </Typography>
      </Footer>
    </PageContainer>
  );
};

export default LandingPage;
