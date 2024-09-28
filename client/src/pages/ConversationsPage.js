import React from "react";
import { styled } from "@mui/material/styles";
import TopNavBar from "../components/TopNavBar";
import SendbirdChat from "../components/SendbirdChat";

const ConversationsPageContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  height: "100%",
});

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh", // Subtract the height of the TopNavBar (adjust if necessary)
  width: "100%",
  overflowY: "hidden",
  padding: 0,
  margin: 0,
}));

const ConversationsPage = () => {
  return (
    <ConversationsPageContainer>
      {/* <TopNavBar title="Messages" /> */}
      <Container>
        <SendbirdChat />
      </Container>
    </ConversationsPageContainer>
  );
};

export default ConversationsPage;
