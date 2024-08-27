import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import videoSrc from "../assets/TheLinkupAppMarketing.mp4"; // Import your video file
import logoSrc from "../assets/logo.png"; // Import your logo file

// Styled Components
const Section = styled("section")(({ theme }) => ({
  height: "100vh",
  backgroundColor: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  padding: theme.spacing(2),
  position: "relative",
}));

const Logo = styled("img")({
  width: "70px", // Adjusted size
  height: "70px", // Adjusted size
  marginRight: "20px", // Space between logo and title
});

const TitleContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(6),
}));

const TextCenterDiv = styled("div")(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  marginTop: "auto",
}));

const Body2Typography = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: "#004D40",
  [theme.breakpoints.up("sm")]: {
    fontSize: "0.875rem",
  },
}));

const AbsoluteDiv = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: -10,
  background: "linear-gradient(135deg, #00ACC1, #00838F)",
});

const BgBlackDiv = styled("div")({
  position: "fixed",
  inset: 0,
  zIndex: -10,
  background: "rgba(0, 0, 0, 0.1)",
  mixBlendMode: "multiply",
});

const ContentWrapperDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "1200px",
  width: "100%",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));

const TextContentDiv = styled("div")(({ theme }) => ({
  flex: 1,
  textAlign: "center",
  [theme.breakpoints.up("md")]: {
    textAlign: "left",
    paddingRight: theme.spacing(4),
  },
}));

const Title = styled("h1")(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: "bold",
  letterSpacing: "tight",
  color: "#00796B",
  [theme.breakpoints.up("sm")]: {
    fontSize: "3rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "4rem",
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  fontSize: "1rem",
  lineHeight: 1.5,
  color: "#004D40",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.25rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.5rem",
  },
}));

const ButtonContainerDiv = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    justifyContent: "center",
  },
  [theme.breakpoints.up("md")]: {
    justifyContent: "flex-start",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
  backgroundColor: "#00838F",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#00796B",
  },
  borderRadius: "20px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
  color: "#00838F",
  borderColor: "#00838F",
  borderRadius: "20px",
  "&:hover": {
    borderColor: "#00796B",
    color: "#00796B",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const VideoContainer = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: "600px",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for a polished look
  marginTop: theme.spacing(4),
  [theme.breakpoints.up("md")]: {
    marginTop: 0,
  },
  order: 3, // Place video third on larger screens
  [theme.breakpoints.down("sm")]: {
    order: 2, // Place video between the title and buttons on mobile
  },
}));

const VideoElement = styled("video")({
  width: "100%",
  height: "auto",
  outline: "none",
});

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
          <ContentWrapperDiv>
            <TextContentDiv>
              <TitleContainer>
                <Logo src={logoSrc} alt="The Linkup Logo" />
                <Title>The Linkup</Title>
              </TitleContainer>

              {/* Video Section */}
              <VideoContainer>
                <VideoElement controls>
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </VideoElement>
              </VideoContainer>

              <Subtitle>
                Connect with new people and organize meetups around your
                interests. Simply create a linkup, receive requests from others,
                chat to coordinate, and choose who to meet up with.
              </Subtitle>
              {/* Terms and Conditions */}
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
            </TextContentDiv>
          </ContentWrapperDiv>
          {/* Footer */}
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
