import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
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
  cursor: "pointer", // Indicate that the container is clickable
  transition: "background-color 0.3s ease", // Smooth transition for hover effect
  "&:hover": {
    backgroundColor: theme.palette.action.hover, // Highlight background on hover
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(2),
  backgroundColor: theme.palette.primary.main, // Use theme primary color
  color: theme.palette.primary.contrastText,
  borderRadius: "50%",
  padding: theme.spacing(1),
}));

const TextWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
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
    <Link to="/home" style={{ textDecoration: "none" }}>
      <HeaderContainer>
        <IconWrapper>
          <ChatBubbleIcon />
        </IconWrapper>
        <TextWrapper>
          <Title variant="h4">Discover New Link-ups</Title>
          <Subtitle variant="body2">
            Check the feed to link up with people!
          </Subtitle>
        </TextWrapper>
      </HeaderContainer>
    </Link>
  );
};

export default ChannelListHeader;
