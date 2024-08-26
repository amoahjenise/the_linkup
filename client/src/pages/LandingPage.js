import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

// Styled Components
const Section = styled("section")(({ theme }) => ({
  height: "100vh", // Ensure full viewport height
  backgroundColor: "white", // Light teal background for a fresh look
  display: "flex", // Use flexbox for centering
  flexDirection: "column", // Stack children vertically
  justifyContent: "center", // Center children vertically
  alignItems: "center", // Center children horizontally
}));

const AbsoluteDiv = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: -10,
  background: "linear-gradient(135deg, #00ACC1, #00838F)", // Cool gradient background
});

const BgBlackDiv = styled("div")({
  position: "fixed",
  inset: 0,
  zIndex: -10,
  background: "rgba(0, 0, 0, 0.1)", // Light overlay for better text contrast
  mixBlendMode: "multiply",
});

const ContentContainerDiv = styled("div")(({ theme }) => ({
  margin: "0 auto",
  maxWidth: "100%", // Ensure full width on small screens
  padding: `${theme.spacing(4)} ${theme.spacing(2)}`, // Adjust padding for smaller screens
  [theme.breakpoints.up("sm")]: {
    padding: `${theme.spacing(6)} ${theme.spacing(4)}`,
  },
  [theme.breakpoints.up("md")]: {
    padding: `${theme.spacing(10)} ${theme.spacing(6)}`,
  },
}));

const TextCenterDiv = styled("div")(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
}));

const Title = styled("h1")(({ theme }) => ({
  fontSize: "2.5rem", // Reduced font size for mobile
  fontWeight: "bold",
  letterSpacing: "tight",
  color: "#00796B", // Deep teal color
  [theme.breakpoints.up("sm")]: {
    fontSize: "3rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "4rem",
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  fontSize: "1rem", // Reduced font size for mobile
  lineHeight: 1.5,
  color: "#004D40", // Dark teal for better readability
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.25rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.5rem",
  },
}));

const ButtonContainerDiv = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(6),
  display: "flex",
  flexDirection: "column", // Stack buttons vertically on mobile
  alignItems: "center",
  gap: theme.spacing(4),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row", // Align buttons horizontally on larger screens
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
  backgroundColor: "#00838F", // Cool teal button color
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#00796B", // Slightly darker teal on hover
  },
  borderRadius: "20px", // Rounded corners for a softer look
  [theme.breakpoints.down("sm")]: {
    width: "100%", // Full width buttons on small screens
  },
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
  color: "#00838F", // Cool teal for the outlined button
  borderColor: "#00838F",
  borderRadius: "20px", // Rounded corners
  "&:hover": {
    borderColor: "#00796B", // Darker teal on hover
    color: "#00796B",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%", // Full width buttons on small screens
  },
}));

const Body2Typography = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem", // Smaller font size for mobile
  color: "#004D40", // Dark teal for text
  [theme.breakpoints.up("sm")]: {
    fontSize: "0.875rem",
  },
}));

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Section>
      {isAuthenticated ? (
        <LoadingSpinner />
      ) : (
        <>
          <AbsoluteDiv />
          <BgBlackDiv aria-hidden="true" />
          <ContentContainerDiv>
            <Title>The Linkup</Title>
            <Subtitle>
              Connect with new people and organizing meetups around your
              interests. Simply create a linkup, receive requests from others,
              chat to coordinate, and choose who to meet up with.
            </Subtitle>

            <Typography
              variant="subtitle2"
              component="small"
              sx={{ marginTop: 2, color: "#0097A7" }} // Darker teal color for text links
            >
              By signing up, you agree to the{" "}
              <a href="/terms-of-service" style={{ color: "#008492" }}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" style={{ color: "#008492" }}>
                Privacy Policy
              </a>
              , including{" "}
              <a href="/cookie-use" style={{ color: "#008492" }}>
                Cookie Use
              </a>
              .
            </Typography>

            <ButtonContainerDiv>
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
            </ButtonContainerDiv>
          </ContentContainerDiv>
          <TextCenterDiv>
            <Body2Typography>
              &copy; {new Date().getFullYear()} The Linkup. All rights reserved.
            </Body2Typography>
          </TextCenterDiv>
        </>
      )}
    </Section>
  );
};

export default LandingPage;
