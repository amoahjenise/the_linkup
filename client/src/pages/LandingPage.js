import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import logoSrc from "../assets/logo.png";
import AppDarkMode from "../assets/LandingPagePreview.png";
import AppLightMode from "../assets/LandingPagePreview.png";
import Wallpaper from "../assets/Image1.jpg";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

// Styled Components
const PageContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  background: `url(${Wallpaper}) no-repeat center center fixed`,
  backgroundSize: "cover",
  padding: "20px",
});

const Logo = styled("img")({
  width: "30px",
  height: "30px",
  marginRight: "10px",
  filter: "invert(1)", // White logo for dark backgrounds
});

const ContentContainer = styled("main")(({ theme }) => ({
  display: "flex",
  flex: 1,
  padding: theme.spacing(3),
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    flexDirection: "column", // Stack elements in a column
    justifyContent: "center",
    alignItems: "center",
  },
}));

const LeftColumn = styled("div")(({ theme }) => ({
  flex: 1,
  textAlign: "center",
  padding: theme.spacing(3),
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  [theme.breakpoints.up("md")]: {
    textAlign: "left",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    backgroundColor: "transparent",
    backdropFilter: "none",
    boxShadow: "none",
    marginBottom: theme.spacing(3),
  },
}));

const RightColumn = styled("div")(({ theme }) => ({
  flex: 1,
  display: "none",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(1),
  [theme.breakpoints.up("md")]: {
    display: "flex", // Show on larger screens
  },
  [theme.breakpoints.down("sm")]: {
    display: "none", // Hide on smaller screens
  },
}));

const ResponsiveImage = styled("img")(({ theme }) => ({
  maxHeight: "275px", // Limit the maximum height
  width: "auto", // Maintain the aspect ratio
  maxWidth: "100%", // Prevent overflow while allowing it to be responsive
  borderRadius: "8px", // Softer corners
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)", // Subtle shadow for a clean look
  transition: "transform 0.3s ease", // Smooth hover effect
  "&:hover": {
    transform: "scale(1.08)", // Slight zoom effect on hover for interaction
  },
}));

const Footer = styled("footer")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
  borderTop: "1px solid #e0e0e0",
  color: "#FFFFFF",
  backgroundColor: "transparent",
  [theme.breakpoints.down("sm")]: {
    paddingBottom: theme.spacing(3),
    textAlign: "center",
  },
}));

const Title = styled("h1")(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: "bold",
  color: "white",
  [theme.breakpoints.up("sm")]: {
    fontSize: "2.5rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "3rem",
  },
  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: "white",
  marginTop: theme.spacing(3),
  fontSize: "1.3rem",
  fontWeight: "600px",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.3rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.6rem",
  },
  textShadow: "2px 2px 10px rgba(0, 0, 0, 0.9)", // Stronger text shadow for better contrast
}));

const StyledButton = styled(SignUpButton)(({ theme }) => ({
  textTransform: "none",
  padding: theme.spacing(1.5, 4),
  fontSize: "1rem",
  fontWeight: "bold",
  border: "2px solid rgb(255, 255, 255)", // Border to match button text
  background: "linear-gradient(45deg,rgb(51, 51, 51, 0.7), #5C6BC0)", // Sleek charcoal and slate blue gradient
  color: "#FFFFFF",
  borderRadius: "30px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease", // Shorter transition for a subtler effect
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", // Subtle shadow change
  },
  margin: theme.spacing(1, 0),
  [theme.breakpoints.down("sm")]: {
    width: "100%", // Full width button for smaller screens
  },
}));

const OutlinedButton = styled(SignInButton)(({ theme }) => ({
  textTransform: "none",
  padding: theme.spacing(1.5, 4),
  fontSize: "1rem",
  fontWeight: "bold",
  border: "2px solid rgb(255, 255, 255)", // Border to match button text
  borderRadius: "30px",
  color: "#FFFFFF",
  background:
    "linear-gradient(45deg, rgba(255, 255, 255, 0.5), rgba(63, 81, 181, 0.75))", // Subtle gradient with blue tones
  transition:
    "background-color 0.3s ease, color 0.3s ease, transform 0.3s ease",
  "&:hover": {
    backgroundColor: "linear-gradient(45deg, #4CAF50, #2196F3)", // Match the primary button gradient on hover
    color: "#FFFFFF", // Change text to white on hover for contrast
    transform: "translateY(-2px)",
  },
  margin: theme.spacing(1, 0),
  [theme.breakpoints.down("sm")]: {
    width: "100%", // Full width button for smaller screens
  },
}));

const ButtonContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2), // Add space between buttons
  marginTop: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    width: "100%", // Full width container for smaller screens
  },
}));

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { colorMode } = useColorMode();

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
          <Subtitle>
            Connect with new people and organize meetups around your interests.
          </Subtitle>
          <Typography
            variant="subtitle2"
            component="small"
            sx={{
              marginTop: 2,
              color: "#FFFFFF",
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
              fontSize: "16px",
            }}
          >
            By signing up, you agree to the{" "}
            <a href="/terms-of-service" style={{ color: "white" }}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" style={{ color: "white" }}>
              Privacy Policy
            </a>
            , including{" "}
            <a href="/cookie-use" style={{ color: "white" }}>
              Cookie Use
            </a>
            .
          </Typography>
          <ButtonContainer>
            <StyledButton
              forceRedirectUrl="/registration" // Redirect to /registration after signing up
              fallbackRedirectUrl="/registration"
              mode="modal"
            >
              Sign Up
            </StyledButton>
            <OutlinedButton
              forceRedirectUrl="/home" // Redirect to /home after signing in
              fallbackRedirectUrl="/home"
              mode="modal"
            >
              Sign In
            </OutlinedButton>
          </ButtonContainer>
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
