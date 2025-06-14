import React from "react";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import moment from "moment";
import { useColorMode } from "@chakra-ui/react";
import NotificationAvatar from "./NotificationAvatar"; // Import your external component

const NotificationItemWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "isUnread" && prop !== "colorMode",
})(({ theme, isUnread, colorMode }) => ({
  display: "flex",
  alignItems: "center",
  padding: "16px 16px",
  cursor: "pointer",
  border: "1px solid rgba(63, 75, 91, 0.25)",
  backgroundColor: isUnread
    ? "rgba(173, 216, 230, 0.15)"
    : colorMode === "dark"
    ? "rgb(16, 16, 16)"
    : "rgba(0, 0, 0, 0.015)",
  borderRadius: "12px",
  boxShadow:
    colorMode === "dark"
      ? "0 2px 8px rgba(255, 255, 255, 0.08)"
      : "0 2px 8px rgba(0, 0, 0, 0.05)",
  transition: "background-color 0.2s ease, box-shadow 0.2s ease",
  height: "100px",
  overflow: "hidden",
  "&:hover": {
    borderRadius: "8px",
    backgroundColor: isUnread
      ? "rgba(144, 200, 215, 0.2)"
      : colorMode === "dark"
      ? "rgba(200, 200, 200, 0.1)"
      : "rgba(210, 210, 210, 0.2)",
  },
  "&:last-child": {
    marginBottom: "0",
  },
}));

const NotificationContent = styled("div")(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
}));

const NotificationTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  fontWeight: 400,
  fontSize: "0.825rem",
  lineHeight: "1",
  color: colorMode === "light" ? theme.palette.text.primary : "#FFFFFF",
}));

const NotificationMessage = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  fontSize: "0.8rem",
  color: colorMode === "light" ? theme.palette.text.secondary : "#B0B0B0",
  marginTop: theme.spacing(0.5),
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  lineHeight: "1",
  "@media (max-width: 600px)": {
    maxWidth: "20ch",
  },
  "@media (min-width: 601px)": {
    maxWidth: "50ch",
  },
}));

const NotificationTime = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  fontSize: "0.75rem",
  marginTop: theme.spacing(0.5),
  color: colorMode === "light" ? theme.palette.text.secondary : "#B0B0B0",
}));

const NotificationItem = ({ notification, onClick }) => {
  const { colorMode } = useColorMode();

  const getTimeAgo = (createdAt) => {
    const now = moment();
    const created = moment(createdAt);
    const duration = moment.duration(now.diff(created));

    const years = duration.years();
    const months = duration.months();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (years > 0) {
      return `${years} year${years !== 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (seconds > 0) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  const getIsUserOnline = () => {
    switch (notification.notification_type) {
      case "linkup_request":
        return notification.requester_is_online;
      case "linkup_request_action":
        return notification.receiver_is_online;
      case "new_message":
        return notification.requester_is_online;
      default:
        return "";
    }
  };

  const getDisplayName = () => {
    switch (notification.notification_type) {
      case "linkup_request":
        return notification.requester_name;
      case "linkup_request_action":
        return notification.receiver_name;
      case "new_message":
        return notification.requester_name;
      default:
        return "";
    }
  };

  const getDisplayAvatar = () => {
    switch (notification.notification_type) {
      case "linkup_request":
        return notification.requester_avatar;
      case "linkup_request_action":
        return notification.receiver_avatar;
      case "new_message":
        return notification.requester_avatar;
      default:
        return "";
    }
  };

  return (
    <NotificationItemWrapper
      isUnread={!notification.is_read}
      onClick={onClick}
      colorMode={colorMode}
    >
      <NotificationAvatar
        src={getDisplayAvatar()}
        alt={getDisplayName()}
        isOnline={getIsUserOnline()}
      />

      <NotificationContent>
        <NotificationTitle colorMode={colorMode}>
          {notification.notification_type === "linkup_request" ? (
            <>
              <span>{notification.requester_name}</span>
              <span> wants to link up with you!</span>
            </>
          ) : notification.notification_type === "linkup_request_action" ? (
            <>
              <span>{notification.content}</span>
            </>
          ) : (
            <>
              <span>{notification.requester_name}</span>
              <span> sent you a new message:</span>
            </>
          )}
        </NotificationTitle>
        {notification.notification_type === "linkup_request" && (
          <NotificationMessage colorMode={colorMode}>
            <span>{notification.message}</span>
          </NotificationMessage>
        )}
        {notification.notification_type === "new_message" && (
          <NotificationMessage colorMode={colorMode}>
            <span>{notification.content}</span>
          </NotificationMessage>
        )}
        <NotificationTime colorMode={colorMode}>
          {getTimeAgo(notification.created_at)}
        </NotificationTime>
      </NotificationContent>
    </NotificationItemWrapper>
  );
};

export default NotificationItem;
