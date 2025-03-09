import React, { useEffect, memo } from "react";
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
import WidgetTemplate from "../components/WidgetTemplate";
import { styled } from "@mui/material/styles";
import Wallpaper from "../assets/Image5.jpg";
import Wallpaper2 from "../assets/Image2.jpg";
import { useTheme } from "@mui/material/styles";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

// Custom styled SignInButton and SignUpButton
const CustomSignInButton = styled(SignInButton)(({ theme }) => ({
  backgroundColor: "rgba(0, 151, 167, 0.8)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(0, 151, 167, 1)",
  },
  padding: "6px 20px", // Added padding to match the button style
  borderRadius: "4px", // Slight border radius for a cleaner look
  textTransform: "none", // Prevents text from being uppercased
  fontWeight: 600, // Bold text
  letterSpacing: "0.5px", // Adjusts spacing between letters
  fontSize: "14px", // Standard font size for the button text
}));

const CustomSignUpButton = styled(SignUpButton)(({ theme }) => ({
  backgroundColor: "rgba(0, 151, 167, 0.9)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(0, 151, 167, 1)",
  },
  padding: "6px 20px", // Added padding to match the button style
  borderRadius: "4px", // Slight border radius for a cleaner look
  textTransform: "none", // Prevents text from being uppercased
  fontWeight: 600, // Bold text
  letterSpacing: "0.5px", // Adjusts spacing between letters
  fontSize: "14px", // Standard font size for the button text
}));

// Footer component styled
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

// Widgets for desktop view
const SignUpWidget = memo(() => (
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
      maxWidth: "225px", // Max width for better layout on medium screens
      height: "225px",
      width: "225px", // Max width for better layout on medium screens
      marginBottom: "20px", // Ensure there's spacing between widgets
    }}
  >
    <CardContent sx={{ textAlign: "center", color: "white" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Explore fun activities with The Linkup Platform
      </Typography>
    </CardContent>
  </Card>
));

const TermsAndServiceWidget = memo(() => (
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
      width: "225px", // Max width for better layout on medium screens
      maxWidth: "225px", // Max width for better layout on medium screens
      height: "225px",
    }}
  >
    <CardContent sx={{ textAlign: "center" }}>
      <Typography variant="h6" color="white" sx={{ fontWeight: "bold" }}>
        By signing up, you agree to the
      </Typography>
      <Typography variant="body1" sx={{ mt: 2, color: "white" }}>
        <a href="/terms-of-service" style={{ color: "white" }}>
          Terms of Service
        </a>
        ,{" "}
        <a href="/privacy-policy" style={{ color: "white" }}>
          Privacy Policy
        </a>{" "}
        and{" "}
      </Typography>
      <Typography variant="body2" sx={{ color: "gray" }}>
        <a href="/cookie-use" style={{ color: "white" }}>
          Cookie Use
        </a>
        .
      </Typography>
    </CardContent>
  </Card>
));

// Main LandingPage component
const LandingPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is small
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        padding: "40px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        background: isSmallScreen
          ? `url(${Wallpaper2}) no-repeat center center fixed` // Apply wallpaper on mobile
          : "linear-gradient(135deg, rgb(0, 0, 0), rgb(15, 0, 38))", // Default background for large screens
        backgroundSize: "cover",
      }}
    >
      <LogoHeader forcedColorMode="dark" />

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

            {/* Add the description text here */}
            <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
              Connect with new people and organize meetups around your
              interests.
            </Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>
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
          </Grid>
        </Grid>
      ) : (
        // Large screen layout
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{
            maxWidth: "1200px",
            paddingTop: "40px",
            paddingBottom: "40px",
            [theme.breakpoints.down("sm")]: {
              flexDirection: "column", // Stack columns on small screens
              alignItems: "center", // Center the content for small screens
            },
            [theme.breakpoints.between(900, 1220)]: {
              flexDirection: "row", // Keep them side by side on medium screens
              gap: "120px", // Add gap between the columns
            },
          }}
        >
          {/* WidgetTemplate - Left Side */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
              marginBottom: "20px", // Ensure there's spacing on smaller screens
            }}
          >
            <WidgetTemplate
              image={Wallpaper}
              title="Connect With New People and Organize Meetups"
              subtitle="Around your interests"
            />
          </Grid>

          {/* Right Side - Stacked Widgets */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3} // Updated to 3 for better balance on larger screens
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2, // Increase gap between widgets
              alignItems: "center", // Center widgets on small screens
              justifyContent: "flex-start", // Ensure widgets are aligned to the top
            }}
          >
            <TermsAndServiceWidget />
            <SignUpWidget />
          </Grid>
        </Grid>
      )}

      <Footer>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} The Linkup. All rights reserved.
        </Typography>
      </Footer>
    </Box>
  );
};

export default LandingPage;
