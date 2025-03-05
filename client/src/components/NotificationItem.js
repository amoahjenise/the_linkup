import React from "react";
import { styled } from "@mui/material/styles";
import { Avatar, Typography } from "@mui/material";
import moment from "moment";
import { useColorMode } from "@chakra-ui/react";

// Styled components
const NotificationItemWrapper = styled("div")(({ theme, isUnread }) => ({
  display: "flex",
  alignItems: "center",
  padding: "12px 16px",
  cursor: "pointer",
  backgroundColor: isUnread ? "rgba(173, 216, 230, 0.1)" : "transparent",
  borderRadius: "8px",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: isUnread
      ? "rgba(144, 200, 215, 0.2)"
      : "rgba(200, 200, 200, 0.1)",
  },
}));

const NotificationAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(6),
  height: theme.spacing(6),
  marginRight: theme.spacing(2),
}));

const NotificationContent = styled("div")(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  gap: "2px",
}));

const NotificationTitle = styled(Typography)(({ theme, colorMode }) => ({
  fontWeight: 500,
  fontSize: "0.875rem",
  color:
    colorMode === "light"
      ? theme.palette.text.primary // Light mode text color
      : "#FFFFFF", // Explicit white color for dark mode
}));

const NotificationMessage = styled(Typography)(({ theme, colorMode }) => ({
  fontSize: "0.875rem",
  color:
    colorMode === "light"
      ? theme.palette.text.secondary // Light mode text color
      : "#B0B0B0", // Explicit light gray color for dark mode
  marginTop: theme.spacing(0.5),
}));
const NotificationTime = styled(Typography)(({ theme, colorMode }) => ({
  fontSize: "0.75rem",
  marginTop: theme.spacing(0.5),
  color:
    colorMode === "light"
      ? theme.palette.text.secondary // Light mode text color
      : "#B0B0B0", // Explicit light gray color for dark mode
}));

const NotificationItem = ({ notification, onClick }) => {
  const { colorMode } = useColorMode();

  const getTimeAgo = () => {
    const now = moment();
    const created = moment(notification.created_at);
    const duration = moment.duration(now.diff(created));
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
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
    <NotificationItemWrapper isUnread={!notification.is_read} onClick={onClick}>
      <NotificationAvatar alt={getDisplayName()} src={getDisplayAvatar()} />
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
            <span>Message: {notification.message}</span>
          </NotificationMessage>
        )}
        {notification.notification_type === "new_message" && (
          <NotificationMessage colorMode={colorMode}>
            <span>{notification.content}</span>
          </NotificationMessage>
        )}
        <NotificationTime colorMode={colorMode}>
          {getTimeAgo()}
        </NotificationTime>
      </NotificationContent>
    </NotificationItemWrapper>
  );
};

export default NotificationItem;
