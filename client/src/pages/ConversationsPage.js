import React from "react";
import { styled } from "@mui/material/styles";
import TopNavBar from "../components/TopNavBar";
import SendbirdChat from "../components/SendbirdChat";

const ConversationsPageContainer = styled("div")(({ theme }) => ({
  // display: "flex",
  // flexDirection: "column",
  // alignItems: "center",
  // width: "100%",
  // height: "100%",
}));

const Container = styled("div")(({ theme }) => ({
  // display: "flex",
  // flexDirection: "column",
  // height: "100%",
  // width: "100%",
  // overflowY: "hidden",
  // padding: 0, // Ensure no padding that might cause spacing
  // margin: 0, // Ensure no margin that might cause spacing
}));

const ConversationsPage = () => {
  return (
    // <ConversationsPageContainer>
    //   <TopNavBar title="Messages" />
    //   <Container>
        <SendbirdChat />
    //   </Container>
    // </ConversationsPageContainer>
  );
};

export default ConversationsPage;
