import React from "react";
import { styled } from "@mui/material/styles";
import { Avatar, Typography, Tooltip } from "@mui/material";
import moment from "moment";
import { useColorMode } from "@chakra-ui/react";

const NotificationItemWrapper = styled("div")(
  ({ theme, isUnread, colorMode }) => ({
    display: "flex",
    alignItems: "center",
    padding: "12px 6px",
    cursor: "pointer",
    backgroundColor: isUnread
      ? "rgba(173, 216, 230, 0.15)"
      : colorMode === "dark"
      ? "rgb(16, 16, 16)"
      : "rgba(0, 0, 0, 0.015)",
    borderRadius: "12px",
    boxShadow:
      colorMode === "dark"
        ? "0 2px 8px rgba(255, 255, 255, 0.08)" // Subtle shadow for dark mode
        : "0 2px 8px rgba(0, 0, 0, 0.05)", // Subtle shadow for light mode
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
    height: "100px", // Fixed height for 3 lines of text
    overflow: "hidden", // Ensure text doesn't overflow
    "&:hover": {
      borderRadius: "8px",
      backgroundColor: isUnread
        ? "rgba(144, 200, 215, 0.2)"
        : colorMode === "dark"
        ? "rgba(200, 200, 200, 0.1)"
        : "rgba(210, 210, 210, 0.2)",
    },
    "&:last-child": {
      marginBottom: "0", // Remove margin for the last item
    },
  })
);

const NotificationAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(6),
  height: theme.spacing(6),
  marginRight: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`, // Add a border for a polished look
  position: "relative", // Required for positioning the online indicator
}));

const OnlineIndicator = styled("div")(({ theme, isOnline, colorMode }) => ({
  position: "relative",
  bottom: "-20px", // Position at the bottom-right corner
  right: "-45px",
  width: "12px", // Slightly larger for better visibility
  height: "12px",
  borderRadius: "50%", // Circular shape
  backgroundColor: isOnline ? "#4CAF50" : "#B0B0B0", // Green for online, gray for offline
  border: `2px solid ${colorMode === "dark" ? "black" : "white"}`, // Border to stand out
  zIndex: 1,
}));

const NotificationContent = styled("div")(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
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
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",

  // Truncate based on screen size
  "@media (max-width: 600px)": {
    // Mobile: limit to 25 characters
    maxWidth: "25ch",
  },
  "@media (min-width: 601px)": {
    // Desktop: limit to 50 characters
    maxWidth: "50ch",
  },
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
      <Tooltip title={getIsUserOnline() ? "Online" : "Offline"} arrow>
        <OnlineIndicator isOnline={getIsUserOnline()} colorMode={colorMode} />
      </Tooltip>
      <NotificationAvatar
        alt={getDisplayName()}
        src={getDisplayAvatar()}
      ></NotificationAvatar>
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
          {getTimeAgo(notification.created_at)}
        </NotificationTime>
      </NotificationContent>
    </NotificationItemWrapper>
  );
};

export default NotificationItem;
