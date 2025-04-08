import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useColorMode } from "@chakra-ui/react";

// Styled components with enhanced typography and subtle animations
const HeaderContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  width: "100%",
  position: "sticky",
  top: 0,
  borderBottom:
    colorMode === "dark"
      ? `1px solid ${theme.palette.grey[800]}`
      : `1px solid ${theme.palette.grey[200]}`,
  color:
    colorMode === "dark" ? theme.palette.grey[100] : theme.palette.grey[900],

  padding: theme.spacing(1.25, 2),
  backdropFilter: "blur(8px)",
  transition: "all 0.3s ease",
}));

const TextWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  cursor: "default",
  gap: theme.spacing(0.25),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 600,
  letterSpacing: "-0.015em",
  lineHeight: 1.3,
  fontFamily: "'Inter', -apple-system, sans-serif",
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
