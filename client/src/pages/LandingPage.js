import React, { useEffect, useState, memo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import LogoHeader from "../components/LogoHeader";
import { styled } from "@mui/material/styles";
import WidgetTemplate from "../components/WidgetTemplate";
import Wallpaper from "../assets/Image5.jpg";
import Wallpaper2 from "../assets/Image2.jpg";
import { useTheme } from "@mui/material/styles";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { LoadingPage } from "../pages";
import LoadingSpinner from "../components/LoadingSpinner";
import TypingText from "../components/TypingText";
import FooterLinksSection from "../components/FooterLinksSection";
import { motion } from "framer-motion";

// Enhanced shared button styles with modern interactions
const sharedButtonStyles = {
  padding: "12px 28px", // Slightly more padding for better touch targets
  borderRadius: "24px", // Fully rounded for contemporary look
  textTransform: "none",
  fontWeight: 500,
  letterSpacing: "0.3px",
  fontSize: "15px", // Slightly larger for readability
  width: "auto",
  minWidth: "220px", // More generous minimum width
  transition: `
    background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.25s ease
  `, // Smooth, coordinated transitions
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px", // Slightly more spacing between icon and text
  cursor: "pointer",
  border: "1.5px solid transparent", // Thicker border for modern look
  position: "relative",
  overflow: "hidden", // For potential pseudo-elements
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", // Subtle floating effect
  },
  "&:active": {
    transform: "translateY(0) scale(0.98)", // Gentle press-down effect
    transitionDuration: "0.1s", // Faster feedback on press
  },
  "&::before": {
    // Modern background hover effect
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255, 255, 255, 0.1)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover::before": {
    opacity: 1,
  },
};

// Enhanced ButtonContent with smooth icon transition
const ButtonContent = ({ icon, text }) => (
  <>
    {icon && (
      <div
        className="material-icons"
        style={{
          fontSize: "20px",
          transition: "transform 0.2s ease",
          transform: "translateX(0)",
        }}
      >
        {icon}
      </div>
    )}
    <div style={{ transition: "transform 0.2s ease" }}>{text}</div>
  </>
);

// Modern Sign In Button with layered hover effects
const CustomSignInButton = styled(SignInButton)(({ theme }) => ({
  ...sharedButtonStyles,
  backgroundColor: "#0097A7",
  color: "white",
  borderColor: "#00838F",
  boxShadow: "0 2px 8px rgba(0, 151, 167, 0.3)", // Base shadow for depth
  "&:hover": {
    backgroundColor: "#00838F",
    boxShadow: "0 6px 20px rgba(0, 151, 167, 0.4)",
    "& span": {
      transform: "scale(1.02)", // Gentle scale effect
    },
  },
  "&:active": {
    backgroundColor: "#006064",
    boxShadow: "0 2px 6px rgba(0, 151, 167, 0.3)",
  },
  "&::before": {
    background: "rgba(255, 255, 255, 0.15)", // Stronger overlay for colored buttons
  },
}));

// Vibrant Sign Up Button with depth
const CustomSignUpButton = styled(SignUpButton)(({ theme }) => ({
  ...sharedButtonStyles,
  backgroundColor: "#0097A7",
  color: "white",
  borderColor: "#00838F",
  boxShadow: "0 2px 8px rgba(0, 151, 167, 0.3)", // Base shadow for depth
  "&:hover": {
    backgroundColor: "#00838F",
    boxShadow: "0 6px 20px rgba(0, 151, 167, 0.4)",
    "& span": {
      transform: "scale(1.02)", // Gentle scale effect
    },
  },
  "&:active": {
    backgroundColor: "#006064",
    boxShadow: "0 2px 6px rgba(0, 151, 167, 0.3)",
  },
  "&::before": {
    background: "rgba(255, 255, 255, 0.15)", // Stronger overlay for colored buttons
  },
}));

// Install App Button with modern metallic sheen
const CustomInstallAppButton = styled("button")(({ theme }) => ({
  ...sharedButtonStyles,
  backgroundColor: "rgba(255, 216, 20, 0.9)", // Neon pink (DeepPink)
  color: "white",
  border: "none",
  cursor: "pointer",
  width: "100%",
  marginTop: 8,
  boxShadow: "0 0 8px rgba(255, 216, 20, 0.6)", // Adds glow effect
  "&:hover": {
    backgroundColor: "rgba(255, 216, 20, 1)",
    boxShadow: "0 0 12px rgba(255, 216, 20, 0.8)", // Enhanced glow on hover
    "& span:first-of-type": {
      transform: "translateY(-1px) rotate(5deg)", // Playful icon animation
    },
  },
  borderColor: "#e0e0e0",
  "&:active": {
    backgroundImage:
      "linear-gradient(to bottom, rgba(255, 216, 20, 0.7), rgba(255, 216, 20, 1))",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
}));

// Footer component styled
const Footer = styled("footer")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
  // borderTop: "1px solid #e0e0e0",
  color: "#FFFFFF",
  // backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent dark overlay
  backdropFilter: "blur(3px)", // Frosted glass effect
  [theme.breakpoints.down("sm")]: {
    paddingBottom: theme.spacing(3),
    textAlign: "center",
  },
}));

// Widgets for desktop view
const SignUpWidget = memo(({ isWidgetLoading }) => (
  <Card
    sx={{
      cursor: "default",
      position: "relative",
      backgroundImage: `url(${Wallpaper2})`, // Set image as background
      backgroundSize: "cover",
      backgroundPosition: "center",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "scale(1.05)",
      },
      maxWidth: "200px", // Max width for better layout on medium screens
      height: "200px",
      width: "200px", // Max width for better layout on medium screens
      marginBottom: "20px", // Ensure there's spacing between widgets
      opacity: isWidgetLoading ? 0.5 : 1, // Add opacity when loading
    }}
  >
    {isWidgetLoading && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "20px",
        }}
      >
        <LoadingSpinner size={40} thickness={4} color="secondary" />
      </Box>
    )}
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <Typography
        variant="h7"
        color="white"
        sx={{
          fontWeight: 600,
          letterSpacing: "0.5px",
          lineHeight: 1.3,
          textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          maxWidth: "90%", // Prevents text from touching edges
        }}
      >
        Explore fun activities with The Linkup Platform
      </Typography>
    </CardContent>
  </Card>
));

const TermsAndServiceWidget = memo(({ isWidgetLoading }) => (
  <Card
    sx={{
      cursor: "default",
      position: "relative",
      background: `linear-gradient(45deg, rgba(211, 254, 255, 0.75), rgba(30, 73, 79, 0.75))`,
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "scale(1.05)",
      },
      width: "200px", // Max width for better layout on medium screens
      maxWidth: "200px", // Max width for better layout on medium screens
      height: "200px",
      opacity: isWidgetLoading ? 0.5 : 1, // Add opacity when loading
    }}
  >
    {isWidgetLoading && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "20px",
        }}
      >
        <LoadingSpinner size={40} thickness={4} color="secondary" />
      </Box>
    )}
    <CardContent sx={{ textAlign: "center" }}>
      <Typography variant="h7" color="white" sx={{ fontWeight: "bold" }}>
        By signing up, you agree to the
      </Typography>
      <Box sx={{ mt: 1.5 }}>
        <Typography
          variant="body2"
          component="div"
          sx={{
            color: "white",
            lineHeight: 1.6,
          }}
        >
          <Box
            component="a"
            href="/terms-of-service"
            sx={{
              color: "white",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              },
            }}
          >
            Terms of Service
          </Box>
          {", "}
          <Box
            component="a"
            href="/privacy-policy"
            sx={{
              color: "white",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              },
            }}
          >
            Privacy Policy
          </Box>
          {", and "}
          <Box
            component="a"
            href="/cookie-use"
            sx={{
              color: "white",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              },
            }}
          >
            Cookie Policy
          </Box>
          {"."}
        </Typography>
      </Box>
    </CardContent>
  </Card>
));

// Main LandingPage component
const LandingPage = ({ showInstallButton, handleInstallClick, isMobile }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is small
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true); // loading state
  const [isWidget1Loading, setWidget1Loading] = useState(true);
  const [isWidget2Loading, setWidget2Loading] = useState(true);
  const [isWidget3Loading, setWidget3Loading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 1 second delay

    return () => clearTimeout(timer); // cleanup if component unmounts
  }, []);

  useEffect(() => {
    // Simulate widget loading
    const widget1Timer = setTimeout(() => setWidget1Loading(false), 500);
    const widget2Timer = setTimeout(() => setWidget2Loading(false), 750);
    const widget3Timer = setTimeout(() => setWidget3Loading(false), 1000);

    return () => {
      clearTimeout(widget1Timer);
      clearTimeout(widget2Timer);
      clearTimeout(widget3Timer);
    };
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100dvh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000", // optional: matches your app background
        }}
      >
        <LoadingPage size={60} thickness={4} color="secondary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "40px",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        background: isSmallScreen
          ? "black" //`url(${Wallpaper2}) no-repeat center center fixed`
          : `linear-gradient(135deg, rgb(0, 0, 0), rgb(15, 0, 38))`, // Default background for large screens
        backgroundSize: "cover",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <LogoHeader forcedColorMode="dark" isMobile={isMobile} />
      </motion.div>
      {/* Small screen layout */}
      {isSmallScreen ? (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{
            maxWidth: "1200px",
            paddingTop: "40px",
            paddingBottom: "40px",
          }}
        >
          {/* Mobile View: Sign In/Sign Up and Terms */}
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2, // Increase gap between items
              alignItems: "center", // Center items on small screens
            }}
          >
            {showInstallButton && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <CustomInstallAppButton onClick={handleInstallClick}>
                  <ButtonContent icon="get_app" text="Download App" />
                </CustomInstallAppButton>
              </Box>
            )}

            {/* Add the description text here */}
            <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
              Connect with new people and organize meetups around your
              interests.
            </Typography>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2, // Increase gap between items
                alignItems: "center", // Center items on small screens
              }}
            >
              <Typography variant="body2" sx={{ mt: 2 }}>
                <a href="/terms-of-service" style={{ color: "white" }}>
                  Terms of Service
                </a>{" "}
                |{" "}
                <a href="/privacy-policy" style={{ color: "white" }}>
                  Privacy Policy
                </a>
              </Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>
                <a href="/cookie-use" style={{ color: "white" }}>
                  Cookie Use
                </a>
                .
              </Typography>
            </div>
            {/* Custom Sign Up Button */}
            <CustomSignUpButton
              sx={{
                width: "200px",
              }}
              variant="contained"
              forceRedirectUrl="/registration"
              fallbackRedirectUrl="/registration"
              mode="modal"
            >
              SIGN UP
            </CustomSignUpButton>
            {/* Custom Sign In Button */}
            <CustomSignInButton
              sx={{
                width: "200px",
                marginBottom: "16px", // Space between buttons
              }}
              variant="contained"
              forceRedirectUrl="/home"
              fallbackRedirectUrl="/home"
              mode="modal"
            >
              SIGN IN
            </CustomSignInButton>
          </Grid>
        </Grid>
      ) : (
        // Large screen layout
        <Grid
          container
          spacing={0}
          justifyContent="center"
          alignItems="flex-start"
          sx={{
            maxWidth: "1200px",
            paddingTop: "40px",
            paddingBottom: "40px",
            // Always maintain desktop layout (left + right widgets)
            flexDirection: "row",
            gap: "120px", // Consistent gap between left and right widgets
            // Responsive adjustments
            [theme.breakpoints.down("md")]: {
              gap: "120px", // Smaller gap on medium screens
            },
            [theme.breakpoints.down("sm")]: {
              flexWrap: "nowrap", // Prevent wrapping
              overflowX: "auto", // Enable horizontal scrolling if needed
              paddingBottom: "20px", // Space for scrollbar
              "&::-webkit-scrollbar": {
                height: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(255,255,255,0.3)",
                borderRadius: "3px",
              },
              // Force minimum widths to prevent overlap
              minWidth: "calc(200px + 200px + 40px)", // Widget widths + gap
            },
          }}
        >
          {/* WidgetTemplate - Left Side */}
          <Grid
            item
            sx={{
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
              // Fixed width for all screen sizes
              height: "450px",
              width: "200px",
              flexShrink: 0, // Prevent shrinking
            }}
          >
            <WidgetTemplate
              image={Wallpaper}
              title="Connect With New People and Organize Meetups"
              subtitle="Around your interests"
              isWidgetLoading={isWidget1Loading}
              handleInstallClick={handleInstallClick}
              showInstallButton={showInstallButton}
            />
          </Grid>

          {/* Right Side - Stacked Widgets */}
          <Grid
            item
            sx={{
              display: "flex",
              flexDirection: "column",
              marginTop: "12px",
              gap: "20px",
              // Fixed width for all screen sizes
              width: "200px",
              flexShrink: 0, // Prevent shrinking
            }}
          >
            <TermsAndServiceWidget isWidgetLoading={isWidget2Loading} />
            <SignUpWidget isWidgetLoading={isWidget3Loading} />
          </Grid>
        </Grid>
      )}

      <Footer>
        {/* <Typography variant="body2">         
          &copy; {new Date().getFullYear()} The Linkup. All rights reserved.
        </Typography> */}

        <TypingText
          text={`© ${new Date().getFullYear()} The Linkup. All rights reserved.`}
          speed={50}
          delay={500}
          variant="body2"
          color="white"
        />
        <FooterLinksSection />
      </Footer>
    </Box>
  );
};

export default LandingPage;
