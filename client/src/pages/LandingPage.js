import React, { memo } from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import LogoHeader from "../components/LogoHeader";
import WidgetTemplate from "../components/WidgetTemplate";
import { styled } from "@mui/material/styles";
import Wallpaper from "../assets/Image5.jpg";
import Wallpaper2 from "../assets/Image2.jpg";
import { useTheme } from "@mui/material/styles";

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

const Logo = styled("img")({
  width: "30px",
  height: "30px",
  marginRight: "10px",
  filter: "invert(1)", // White logo for dark backgrounds
});

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
        Join The Linkup Platform
      </Typography>
    </CardContent>
  </Card>
));

const TermsAndServiceWidget = memo(() => (
  <Card
    sx={{
      cursor: "default",
      position: "relative",
      background: `linear-gradient(45deg, rgba(211, 254, 255, 0.85), rgba(30, 73, 79, 0.75))`,
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
        </a>{" "}
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

const LandingPage = () => {
  const theme = useTheme(); // Make sure theme is initialized using useTheme

  return (
    <Box
      sx={{
        padding: "40px",
        background: "linear-gradient(135deg, rgb(0, 0, 0), rgb(15, 0, 38))",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <LogoHeader />
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{
          maxWidth: "1200px",
          paddingTop: "40px",
          paddingBottom: "40px",
          [theme.breakpoints.down("md")]: {
            flexDirection: "column", // Stack columns on medium screens
            alignItems: "center", // Center the content for small screens
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

      <Footer>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} The Linkup. All rights reserved.
        </Typography>
      </Footer>
    </Box>
  );
};

export default LandingPage;
