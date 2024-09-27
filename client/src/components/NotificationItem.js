import React from "react";
import { styled } from "@mui/material/styles";
import { Avatar, Typography } from "@mui/material";
import moment from "moment";

// Styled components
const NotificationItemWrapper = styled("div")(({ theme, isUnread }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  minHeight: "120px", // Set a fixed height for each notification item
  padding: theme.spacing(2),
  borderBottom: "1px solid #D3D3D3",
  cursor: "pointer",
  transition: "background-color 0.3s ease-in-out",
  backgroundColor: isUnread ? "rgba(220, 200, 220, 0.1)" : "inherit",
  "&:hover": {
    backgroundColor: "rgba(200, 200, 200, 0.1)",
  },
}));

const NotificationContent = styled("div")(({ theme }) => ({
  marginLeft: theme.spacing(2), // Add spacing between avatar and content
  flexGrow: 1, // Allow content to grow and occupy remaining space
}));

const NotificationAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10), // Adjust avatar size
  height: theme.spacing(10), // Adjust avatar size
}));

const MessageTypography = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
}));

const TimeTypography = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
}));

const NotificationItem = ({ notification, onClick }) => {
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
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
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
              <MessageTypography className="message">
                {" "}
                {notification.content}
              </MessageTypography>
            </>
          )}
        </Typography>
        {notification.notification_type === "linkup_request" && (
          <Typography variant="body2" className="message">
            <span>Message: {notification.message}</span>
          </Typography>
        )}
        <TimeTypography variant="caption">{getTimeAgo()}</TimeTypography>
      </NotificationContent>
    </NotificationItemWrapper>
  );
};

export default NotificationItem;
