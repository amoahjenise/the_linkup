// NotificationsPage.js
import React from "react";
import { styled } from "@mui/material/styles";
import Notifications from "../components/Notifications";
import { useColorMode } from "@chakra-ui/react";

const NotificationsPageWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "1536px", // Added max-width for extra large screens
  margin: "0 auto", // Center the content
  height: "100vh",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const NotificationSection = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  height: "100%",
  padding: 0,
}));

const NotificationsPage = ({ isMobile }) => {
  const { colorMode } = useColorMode();

  return (
    <NotificationsPageWrapper>
      <NotificationSection>
        <Notifications isMobile={isMobile} colorMode={colorMode} />
      </NotificationSection>
    </NotificationsPageWrapper>
  );
};

export default NotificationsPage;
