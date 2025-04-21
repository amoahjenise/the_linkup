import React from "react";
import { styled } from "@mui/material/styles";
import SendbirdChat from "../components/SendbirdChat";

const ConversationsPageContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  height: "100%",
  // paddingBottom: "5px", // Add padding for footer
  // "@media (max-width: 900px)": {
  //   paddingBottom: "65px", // Add padding for footer
  // },
});

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100dvh", // Subtract the height of the TopNavBar (adjust if necessary)
  width: "100%",
  overflowY: "hidden",
  padding: 0,
  margin: 0,
});

const ConversationsPage = () => {
  return (
    <ConversationsPageContainer>
      <Container>
        <SendbirdChat />
      </Container>
    </ConversationsPageContainer>
  );
};

export default ConversationsPage;
