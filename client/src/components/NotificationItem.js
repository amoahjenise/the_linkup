import React from "react";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import moment from "moment";
import { useColorMode } from "@chakra-ui/react";
import NotificationAvatar from "./NotificationAvatar";

const NotificationItemWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "isUnread" && prop !== "colorMode",
})(({ theme, isUnread, colorMode }) => {
  return {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2.5),
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    backgroundColor: isUnread
      ? "rgba(173, 216, 230, 0.15)"
      : colorMode === "dark"
      ? "rgb(16, 16, 16)"
      : "rgba(0, 0, 0, 0.015)",

    border: isUnread
      ? `1px solid ${colorMode === "dark" ? "#64bfff33" : "#b8e0ff"}`
      : "1px solid transparent",
    boxShadow: isUnread
      ? colorMode === "dark"
        ? "0 4px 14px rgba(100, 180, 255, 0.15)"
        : "0 4px 12px rgba(173, 216, 230, 0.25)"
      : colorMode === "dark"
      ? "0 2px 8px rgba(0, 0, 0, 0.3)"
      : "0 1px 4px rgba(0, 0, 0, 0.06)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: isUnread
        ? "0 6px 18px rgba(100, 180, 255, 0.25)"
        : "0 4px 12px rgba(0,0,0,0.1)",
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1.5),
    },
  };
});

const NotificationContent = styled("div")(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

const NotificationTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  fontWeight: 600,
  fontSize: "0.825rem",
  lineHeight: 1.2,
  color: colorMode === "light" ? theme.palette.text.primary : "#FFFFFF",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const NotificationMessage = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  fontSize: "0.85rem",
  color: colorMode === "light" ? theme.palette.text.secondary : "#B0B0B0",
  marginTop: theme.spacing(0.5),
  lineHeight: 1.4,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
}));

const NotificationTime = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  fontSize: "0.75rem",
  color: colorMode === "light" ? theme.palette.text.secondary : "#B0B0B0",
  marginTop: theme.spacing(0.5),
}));

const NotificationItem = ({ notification, onClick }) => {
  const { colorMode } = useColorMode();

  const getTimeAgo = (createdAt) => {
    const now = moment();
    const created = moment(createdAt);
    const duration = moment.duration(now.diff(created));

    if (duration.years() > 0) return `${duration.years()}y ago`;
    if (duration.months() > 0) return `${duration.months()}mo ago`;
    if (duration.days() > 0) return `${duration.days()}d ago`;
    if (duration.hours() > 0) return `${duration.hours()}h ago`;
    if (duration.minutes() > 0) return `${duration.minutes()}m ago`;
    return "Just now";
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
    return (
      notification.requester_name || notification.receiver_name || "Someone"
    );
  };

  const getDisplayAvatar = () => {
    return notification.requester_avatar || notification.receiver_avatar || "";
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
        <NotificationTitle>
          {notification.notification_type === "linkup_request" && (
            <>
              <strong>{notification.requester_name}</strong> wants to link up
              with you!
            </>
          )}
          {notification.notification_type === "linkup_request_action" && (
            <>{notification.content}</>
          )}
          {notification.notification_type === "new_message" && (
            <>
              <strong>{notification.requester_name}</strong> sent a new message
            </>
          )}
        </NotificationTitle>

        {(notification.notification_type === "linkup_request" ||
          notification.notification_type === "new_message") && (
          <NotificationMessage>
            {notification.message || notification.content}
          </NotificationMessage>
        )}

        <NotificationTime>
          {getTimeAgo(notification.created_at)}
        </NotificationTime>
      </NotificationContent>
    </NotificationItemWrapper>
  );
};

export default NotificationItem;
