import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

// Styled Components
const Section = styled("section")(({ theme }) => ({
  height: "100%",
  backgroundColor: "#E0F7FA", // Light teal background for a fresh look
}));

const RelativeDiv = styled("div")({
  position: "relative",
  height: "100%",
  overflow: "hidden",
  paddingTop: (theme) => theme.spacing(14),
});

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
  maxWidth: theme.breakpoints.values.xl,
  padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
  [theme.breakpoints.up("sm")]: {
    padding: `${theme.spacing(6)} ${theme.spacing(6)}`,
  },
  [theme.breakpoints.up("md")]: {
    padding: `${theme.spacing(14)} ${theme.spacing(8)}`,
  },
}));

const TextCenterDiv = styled("div")(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(8),
}));

const Title = styled("h1")(({ theme }) => ({
  fontSize: "4rem",
  fontWeight: "bold",
  letterSpacing: "tight",
  color: "#00796B", // Deep teal color
  [theme.breakpoints.up("sm")]: {
    fontSize: "6rem",
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(6),
  fontSize: "1.25rem",
  lineHeight: 2,
  color: "#004D40", // Dark teal for better readability
}));

const ButtonContainerDiv = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(10),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(6),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  backgroundColor: "#00838F", // Cool teal button color
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#00796B", // Slightly darker teal on hover
  },
  borderRadius: "20px", // Rounded corners for a softer look
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
  color: "#00838F", // Cool teal for the outlined button
  borderColor: "#00838F",
  borderRadius: "20px", // Rounded corners
  "&:hover": {
    borderColor: "#00796B", // Darker teal on hover
    color: "#00796B",
  },
}));

const Body2Typography = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  color: "#004D40", // Dark teal for text
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
        <RelativeDiv>
          <AbsoluteDiv />
          <BgBlackDiv aria-hidden="true" />
          <ContentContainerDiv>
            <TextCenterDiv>
              <Title>Welcome To The Linkup!</Title>
              <Subtitle>
                Whether you're looking to connect with new people or organize
                meetups around your interests, The Linkup makes it easy. Create
                a linkup, receive requests from others, chat to coordinate, and
                decide who to meet up with.
              </Subtitle>
              <Typography
                variant="subtitle2"
                component="small"
                sx={{ marginTop: 2 }}
                color={"#0097A7"} // Teal color for text links
              >
                By signing up, you agree to the{" "}
                <a href="/terms-of-service">Terms of Service</a> and{" "}
                <a href="/privacy-policy">Privacy Policy</a>, including{" "}
                <a href="/cookie-use">Cookie Use</a>.
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
            </TextCenterDiv>
          </ContentContainerDiv>
          <TextCenterDiv>
            <Body2Typography>
              &copy; {new Date().getFullYear()} The Linkup. All rights reserved.
            </Body2Typography>
          </TextCenterDiv>
        </RelativeDiv>
      )}
    </Section>
  );
};

export default LandingPage;
