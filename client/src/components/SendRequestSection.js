import React from "react";
import { styled } from "@mui/material/styles";
import SendRequest from "./SendRequest";
import TopNavBar from "./TopNavBar";

// Styled Components
const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  borderRight: "1px solid #e1e8ed",
}));

const MessagesContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "auto",
  width: "100%",
  padding: theme.spacing(4),
}));

const SendRequestSection = ({ linkupId, linkups, colorMode }) => {
  return (
    <Container>
      <TopNavBar title="Request a Linkup" />
      <MessagesContainer>
        <SendRequest
          linkups={linkups}
          linkupId={linkupId}
          colorMode={colorMode}
        />
      </MessagesContainer>
    </Container>
  );
};

export default SendRequestSection;
