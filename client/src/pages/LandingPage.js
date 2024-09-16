import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import videoSrc from "../assets/TheLinkupAppMarketing.mp4"; // Import your video file
import logoSrc from "../assets/logo.png"; // Import your logo file

// Styled Components
const PageContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #a2c2e4 0%, #f7d3c0 100%)", // Soft green-yellow gradient
  padding: "20px", // Added padding for a relaxed, open feel
});

const Logo = styled("img")({
  width: "30px", // Adjusted size for summer feel
  height: "30px",
  marginRight: "10px",
});

const ContentContainer = styled("main")(({ theme }) => ({
  display: "flex",
  flex: 1,
  padding: theme.spacing(4),
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexDirection: "column",
  backgroundColor: "transparent", // Transparent to show the gradient
}));

const LeftColumn = styled("div")(({ theme }) => ({
  flex: 1,
  textAlign: "center",
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    textAlign: "left",
    paddingRight: theme.spacing(4),
  },
}));

const RightColumn = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
  [theme.breakpoints.up("md")]: {
    marginTop: 0,
  },
}));

const Footer = styled("footer")(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
  borderTop: "1px solid #e0e0e0",
  color: "#004D40",
  backgroundColor: "transparent",
}));

const Title = styled("h1")(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: "#00796B", // Same type of green, but bolder for summer
  [theme.breakpoints.up("sm")]: {
    fontSize: "3rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "4rem",
  },
  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)", // Adds a light shadow for depth
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  fontSize: "1.1rem",
  color: "#004D40", // Deep green for subtler text
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.3rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.6rem",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
  backgroundColor: "#00796B", // Summer green
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#004D40",
  },
  borderRadius: "30px", // Rounded button for a playful look
  marginRight: theme.spacing(2),
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for a summer feel
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
  color: "#00796B",
  borderColor: "#00796B",
  borderRadius: "30px", // Rounded edges
  "&:hover": {
    borderColor: "#004D40",
    color: "#004D40",
  },
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
}));

const VideoContainer = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: "600px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  // borderRadius: "15px", // Rounded corners for softness
}));

const VideoElement = styled("video")({
  width: "100%",
  height: "100%",
  outline: "none",
  objectFit: "cover",
  // borderRadius: "15px",
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
    <PageContainer>
      {/* Main Content */}
      <ContentContainer>
        <LeftColumn>
          <Title>The Linkup</Title>
          <Subtitle>
            Connect with new people and organize meetups around your interests.
          </Subtitle>
          {/* Terms and Conditions */}
          <Typography
            variant="subtitle2"
            component="small"
            sx={{ marginTop: 2, color: "#004D40" }}
          >
            By signing up, you agree to the{" "}
            <a href="/terms-of-service" style={{ color: "#00796B" }}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" style={{ color: "#00796B" }}>
              Privacy Policy
            </a>
            , including{" "}
            <a href="/cookie-use" style={{ color: "#00796B" }}>
              Cookie Use
            </a>
            .
          </Typography>
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
          <VideoContainer>
            <VideoElement controls>
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </VideoElement>
          </VideoContainer>
        </RightColumn>
      </ContentContainer>

      {/* Footer */}
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
