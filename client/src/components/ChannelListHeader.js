import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useColorMode } from "@chakra-ui/react";

// Styled components with centered text
const HeaderContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  borderBottom:
    colorMode === "dark"
      ? `1px solid rgba(0, 0, 0, 0.12)`
      : `1px solid ${theme.palette.grey[200]}`,
  boxShadow: "0 1px 1px rgba(0, 0, 0, 0.12)",
  color:
    colorMode === "dark" ? theme.palette.grey[100] : theme.palette.grey[900],
  padding: theme.spacing(1.25, 2),
  backdropFilter: "blur(8px)",
  transition: "all 0.3s ease",
  display: "flex",
  justifyContent: "center", // Center horizontally
}));

const TextWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Center items horizontally in column layout
  textAlign: "center", // Center text within each Typography component
  cursor: "default",
  gap: theme.spacing(0.25),
  maxWidth: "800px", // Optional: set a max width for better readability
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 600,
  letterSpacing: "-0.015em",
  lineHeight: 1.3,
  fontFamily: "'Inter', -apple-system, sans-serif",
  width: "100%", // Ensure text-align center works
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  fontWeight: 400,
  color:
    theme.palette.mode === "dark"
      ? theme.palette.grey[400]
      : theme.palette.grey[600],
  letterSpacing: "0.01em",
  lineHeight: 1.2,
  width: "100%", // Ensure text-align center works
}));

const ChannelListHeader = () => {
  const { colorMode } = useColorMode();

  return (
    <HeaderContainer colorMode={colorMode}>
      <TextWrapper>
        <Title variant="h1">Messages</Title>
        <Subtitle variant="body2">Keep conversations respectful!</Subtitle>
      </TextWrapper>
    </HeaderContainer>
  );
};

export default ChannelListHeader;
