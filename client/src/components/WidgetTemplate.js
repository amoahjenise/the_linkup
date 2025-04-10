import React from "react";
import { Box, Typography } from "@mui/material";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { styled } from "@mui/material/styles";

// Shared button styles to reduce duplication
const sharedButtonStyles = {
  padding: "8px 16px",
  borderRadius: "4px",
  textTransform: "none",
  fontWeight: 600,
  letterSpacing: "0.5px",
  fontSize: "14px",
  transition: "all 0.2s ease",
  flex: 1, // Make buttons share space equally
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
};

// Custom styled buttons using the shared styles
const CustomSignInButton = styled(SignInButton)(({ theme }) => ({
  ...sharedButtonStyles,
  backgroundColor: "rgba(0, 255, 209, 0.8)", // Bright neon teal
  color: "white", // Dark blue-gray for text
  boxShadow: "0 0 8px rgba(0, 255, 209, 0.6)", // Glow effect
  "&:hover": {
    backgroundColor: "rgba(0, 255, 209, 1)",
    boxShadow: "0 0 12px rgba(0, 255, 209, 0.8)", // Stronger glow on hover
  },
}));

const CustomSignUpButton = styled(SignUpButton)(({ theme }) => ({
  ...sharedButtonStyles,
  backgroundColor: "rgba(0, 230, 190, 0.9)", // Slightly deeper neon teal
  color: "white", // Dark blue-gray for text
  boxShadow: "0 0 8px rgba(0, 230, 190, 0.6)", // Glow effect
  "&:hover": {
    backgroundColor: "rgba(0, 230, 190, 1)",
    boxShadow: "0 0 12px rgba(0, 230, 190, 0.8)", // Stronger glow on hover
  },
}));

const CustomInstallAppButton = styled("button")(({ theme }) => ({
  ...sharedButtonStyles,
  backgroundColor: "rgba(255, 20, 147, 0.9)", // Neon pink (DeepPink)
  color: "white",
  border: "none",
  cursor: "pointer",
  width: "100%",
  boxShadow: "0 0 8px rgba(255, 20, 147, 0.6)", // Adds glow effect
  "&:hover": {
    backgroundColor: "rgba(255, 20, 147, 1)",
    boxShadow: "0 0 12px rgba(255, 20, 147, 0.8)", // Enhanced glow on hover
  },
}));

const WidgetTemplate = ({
  image,
  title,
  subtitle,
  isWidgetLoading,
  handleInstallClick,
  showInstallButton,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "300px",
        height: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        minWidth: "300px",
        minHeight: "450px",
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          width: "100%",
          height: "55%",
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content Container */}
      <Box
        sx={{
          position: "absolute",
          top: "55%",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Text Content */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            color="white"
            sx={{
              fontWeight: "bold",
              marginBottom: "4px",
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="subtitle2"
            color="white"
            sx={{
              opacity: 0.8,
              marginBottom: "16px",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        {/* Buttons Container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* Auth Buttons Row */}
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              width: "100%",
            }}
          >
            <CustomSignUpButton
              variant="contained"
              forceRedirectUrl="/registration"
              fallbackRedirectUrl="/registration"
              mode="modal"
            >
              Sign Up
            </CustomSignUpButton>

            <CustomSignInButton
              variant="contained"
              forceRedirectUrl="/home"
              fallbackRedirectUrl="/home"
              mode="modal"
            >
              Sign In
            </CustomSignInButton>
          </Box>

          {/* Install Button */}
          {showInstallButton && (
            <CustomInstallAppButton onClick={handleInstallClick}>
              Install App
            </CustomInstallAppButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default WidgetTemplate;
