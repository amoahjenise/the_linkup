import React from "react";
import { styled } from "@mui/material/styles";
import TopNavBar from "../components/TopNavBar";
import SendbirdChat from "../components/SendbirdChat";

const ConversationsPageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
}));

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflowY: "hidden",
}));

const ConversationsPage = () => {
  return (
    <ConversationsPageContainer>
      <TopNavBar title="Messages" />
      <Container>
        <SendbirdChat />
      </Container>
    </ConversationsPageContainer>
  );
};

export default ConversationsPage;
