import React from "react";
import { styled } from "@mui/material/styles";
import Notifications from "../components/Notifications";

// Define styled components
const NotificationsPageWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  [theme.breakpoints.down("md")]: {
    width: "100%", // Set to 100% in mobile mode
  },
  "@media (max-width: 900px)": {
    marginBottom: "65px", // Add padding for footer
  },
}));

const NotificationSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
});

const NotificationsPage = () => {
  return (
    <NotificationsPageWrapper>
      <NotificationSection>
        <Notifications />
      </NotificationSection>
    </NotificationsPageWrapper>
  );
};

export default NotificationsPage;
