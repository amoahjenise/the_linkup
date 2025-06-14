import React from "react";
import { Box, Typography } from "@mui/material";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { styled } from "@mui/material/styles";

const sharedButtonStyles = {
  padding: "8px 16px",
  borderRadius: "24px", // Fully rounded for contemporary look
  textTransform: "none",
  fontWeight: 500,
  letterSpacing: "0.5px",
  fontSize: "14px",
  width: "auto",
  flex: 1, // Make buttons share space equally
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
      <span
        className="material-icons"
        style={{
          fontSize: "20px",
          transition: "transform 0.2s ease",
          transform: "translateX(0)",
        }}
      >
        {icon}
      </span>
    )}
    <span style={{ transition: "transform 0.2s ease" }}>{text}</span>
  </>
);

// Custom styled buttons using the shared styles
const CustomSignInButton = styled(SignInButton)(({ theme }) => ({
  ...sharedButtonStyles,
  backgroundColor: "rgba(0, 255, 209, 0.8)", // Bright neon teal
  color: "white", // Dark blue-gray for text
  boxShadow: "0 0 8px rgba(0, 255, 209, 0.6)", // Glow effect
  "&:hover": {
    transform: "translateY(-2px)",
    backgroundColor: "rgba(0, 255, 209, 1)",
    boxShadow: "0 0 12px rgba(0, 255, 209, 0.8)", // Stronger glow on hover
  },
  "&:active": {
    transform: "translateY(0) scale(0.96)",
  },
}));

const CustomSignUpButton = styled(SignUpButton)(({ theme }) => ({
  ...sharedButtonStyles,
  backgroundColor: "rgba(0, 230, 190, 0.9)", // Slightly deeper neon teal
  color: "white", // Dark blue-gray for text
  boxShadow: "0 0 8px rgba(0, 230, 190, 0.6)", // Glow effect
  "&:hover": {
    transform: "translateY(-2px)",
    backgroundColor: "rgba(0, 230, 190, 1)",
    boxShadow: "0 0 12px rgba(0, 230, 190, 0.8)", // Stronger glow on hover
  },
  "&:active": {
    transform: "translateY(0) scale(0.96)",
  },
}));

const CustomInstallAppButton = styled("button")(({ theme }) => ({
  ...sharedButtonStyles,
  marginBottom: 4,
  backgroundColor: "rgba(255, 20, 147, 0.9)", // Neon pink (DeepPink)
  color: "white !important", // Force white text color
  border: "none",
  cursor: "pointer",
  width: "100%",
  boxShadow: "0 0 8px rgba(255, 20, 147, 0.6)", // Adds glow effect
  "&:hover": {
    transform: "translateY(-2px)",
    backgroundColor: "rgba(255, 20, 147, 1)",
    boxShadow: "0 0 12px rgba(255, 20, 147, 0.8)", // Enhanced glow on hover
    color: "white !important", // Ensure text stays white on hover
  },
  "&:active": {
    transform: "translateY(0) scale(0.96)",
  },
  "& span": {
    // Target the text span specifically
    color: "white !important",
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
        cursor: "default",
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
          top: "50%",
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
              marginBottom: "10px",
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
              <ButtonContent icon="get_app" text="Download App" />{" "}
            </CustomInstallAppButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default WidgetTemplate;
