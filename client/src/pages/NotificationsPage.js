import React from "react";
import { styled } from "@mui/material/styles";
import Notifications from "../components/Notifications";
import { useColorMode } from "@chakra-ui/react";

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

const NotificationsPage = ({ isMobile }) => {
  const { colorMode } = useColorMode(); // Add this line if using Chakra UI

  return (
    <NotificationsPageWrapper>
      <NotificationSection>
        <Notifications isMobile={isMobile} colorMode={colorMode} />
      </NotificationSection>
    </NotificationsPageWrapper>
  );
};

export default NotificationsPage;
