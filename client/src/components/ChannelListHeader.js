import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useColorMode } from "@chakra-ui/react"; // Import useColorMode from Chakra UI

// Styled components using MUI's styled API
const HeaderContainer = styled(Box)(({ theme, colorMode }) => ({
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar,
  borderBottom:
    colorMode === "dark"
      ? `1px solid white`
      : `1px solid ${theme.palette.divider}`,
  color: colorMode === "dark" ? "white" : "black",
  backgroundColor:
    colorMode === "dark" ? "rgba(0, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.97)",
  padding: theme.spacing(1),
}));

const TextWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  cursor: "default", // Indicate that the container is clickable
});

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: "bold",
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize, // Use theme typography size
}));

const ChannelListHeader = () => {
  const { colorMode } = useColorMode(); // Use useColorMode hook

  return (
    <HeaderContainer colorMode={colorMode}>
      <TextWrapper>
        <Title variant="h4">Messages</Title>
        <Subtitle variant="body2" color={"GrayText"}>
          Please keep conversations respectful and safe!
        </Subtitle>
      </TextWrapper>
    </HeaderContainer>
  );
};

export default ChannelListHeader;
