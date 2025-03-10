import React from "react";
import { styled } from "@mui/material/styles";
import { Typography, Button, Container, Box } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import TopNavBar from "./TopNavBar";

// Styled Components
const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100dvh",
  textAlign: "center",
  marginTop: theme.spacing(8),
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const Icon = styled(SettingsIcon)(({ theme }) => ({
  fontSize: "3rem",
  color: "#0097A7",
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: "#0097A7",
  color: "white",
  "&:hover": {
    backgroundColor: "#007b86", // Slightly darker color on hover
  },
}));

const EnableLocation = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const secondaryTextColor = colorMode === "dark" ? "white" : "textSecondary";

  const handleSettingsClick = () => {
    navigate("/settings"); // Redirect to settings page
  };

  return (
    <div>
      <TopNavBar title="Home" />

      <Root>
        <StyledContainer>
          <Icon />
          <Typography variant="h5" gutterBottom>
            To get the most out of The Linkup experience, please enable location
            sharing in your settings.
          </Typography>
          <Typography variant="body1" color={secondaryTextColor}>
            This feature helps us connect you with nearby people and events,
            enhancing your experience.
          </Typography>
          <StyledButton
            variant="contained"
            onClick={handleSettingsClick}
            startIcon={<SettingsIcon />}
          >
            Go to Settings
          </StyledButton>
        </StyledContainer>
      </Root>
    </div>
  );
};

export default EnableLocation;
