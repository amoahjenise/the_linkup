import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

// Styled Components
const Section = styled("section")(({ theme }) => ({
  height: "100%",
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
});

const BgBlackDiv = styled("div")({
  position: "fixed",
  inset: 0,
  zIndex: -10,
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
  [theme.breakpoints.up("sm")]: {
    fontSize: "6rem",
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(6),
  fontSize: "1.25rem",
  lineHeight: 2,
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
}));

const Body2Typography = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
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
              <Title>Welcome To Link-Up!</Title>
              <Subtitle>
                Join our community to explore a wide range of activities and
                events with like-minded individuals.
              </Subtitle>
              <Typography variant="subtitle2" component="small">
                By signing up, you agree to the{" "}
                <a href="/terms-of-service">Terms of Service</a> and{" "}
                <a href="/privacy-policy">Privacy Policy</a>, including{" "}
                <a href="/cookie-use">Cookie Use</a>.
              </Typography>
              <ButtonContainerDiv>
                <StyledButton
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/sign-up")}
                >
                  Sign Up
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/sign-in")}
                >
                  Log In
                </StyledButton>
              </ButtonContainerDiv>
            </TextCenterDiv>
          </ContentContainerDiv>
          <TextCenterDiv>
            <Body2Typography>
              &copy; {new Date().getFullYear()} Link-Up. All rights reserved.
            </Body2Typography>
          </TextCenterDiv>
        </RelativeDiv>
      )}
    </Section>
  );
};

export default LandingPage;
