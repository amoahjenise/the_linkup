import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// Styled components using MUI's styled API
const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  borderBottomWidth: "1px",
  borderBottomColor: "lightgrey",
  borderBottomStyle: "solid",
  transition: "background-color 0.3s ease", // Smooth transition for hover effect
  "&:hover": {
    backgroundColor: theme.palette.action.hover, // Highlight background on hover
  },
}));

const TextWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  cursor: "default", // Indicate that the container is clickable
});

const Title = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h6.fontSize, // Use theme typography size
  fontWeight: theme.typography.fontWeightBold, // Use theme font weight
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize, // Use theme typography size
}));

const ChannelListHeader = () => {
  return (
    <HeaderContainer>
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
