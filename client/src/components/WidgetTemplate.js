import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

// WidgetTemplate Component
const WidgetTemplate = ({ image, title, subtitle }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "300px", // Fixed width
        height: "460px", // Fixed height
        borderRadius: "16px", // Slightly smaller border radius for a cleaner look
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Slightly more prominent shadow
        minWidth: "300px", // Prevent resizing below this width
        minHeight: "450px", // Prevent resizing below this height
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          width: "100%",
          height: "60%", // Adjusted to allow more space for content
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></Box>

      {/* Content Container with Frosted Glass Effect */}
      <Box
        sx={{
          position: "absolute",
          top: "50%", // Position content below the image
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.3)", // Semi-transparent background
          backdropFilter: "blur(10px)", // Frosted glass effect
          padding: "15px", // Reduced padding for a more compact design
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Space for buttons at the bottom
        }}
      >
        <Box>
          <Typography
            variant="h6"
            color="white"
            sx={{
              fontWeight: "bold",
              marginBottom: "4px", // Reduced space between title and subtitle
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="subtitle2"
            color="white"
            sx={{
              opacity: 0.8,
              marginBottom: "12px", // Slight margin to add breathing room between subtitle and buttons
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px", // Space between buttons
          }}
        >
          {/* Sign Up Button */}
          <Button
            sx={{
              backgroundColor: "rgba(0, 151, 167, 0.8)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 151, 167, 1)",
              },
            }}
            variant="contained"
            forceRedirectUrl="/registration" // Redirect to /registration after signing up
            fallbackRedirectUrl="/registration"
            mode="modal"
          >
            Sign Up
          </Button>

          {/* Sign In Button */}
          <Button
            sx={{
              backgroundColor: "rgba(0, 151, 167, 0.8)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 151, 167, 1)",
              },
            }}
            variant="contained"
            forceRedirectUrl="/home" // Redirect to /home after signing in
            fallbackRedirectUrl="/home"
            mode="modal"
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default WidgetTemplate;
