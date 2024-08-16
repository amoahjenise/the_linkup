import React from "react";
import Box from "@mui/material/Box";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { styled } from "@mui/material/styles";

// Styled components using MUI's styled API
const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  borderBottomWidth: "1px",
  borderBottomColor: "lightgrey",
  borderBottomStyle: "solid",
}));

const IconWrapper = styled("div")(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(2),
  backgroundColor: "#0097A7",
  color: "#fff",
  borderRadius: "50%",
  padding: theme.spacing(1),
}));

const TextWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

const Title = styled("p")({
  fontSize: "1rem",
  fontWeight: "bold",
});

const Subtitle = styled("p")({
  fontSize: "0.875rem",
  color: "#757575", // Replace with your theme's text secondary color if needed
});

const ChannelListHeader = () => {
  return (
    <HeaderContainer>
      <IconWrapper>
        <ChatBubbleIcon />
      </IconWrapper>
      <TextWrapper>
        <Title>Discover New Link-ups</Title>
        <Subtitle>Check the feed to link up with people!</Subtitle>
      </TextWrapper>
    </HeaderContainer>
  );
};

export default ChannelListHeader;
