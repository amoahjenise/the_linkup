import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  notificationItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "120px", // Set a fixed height for each notification item
    padding: theme.spacing(2),
    borderBottomWidth: "1px",
    borderBottomColor: "1px solid #D3D3D3",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(200, 200, 200, 0.1)",
    },
  },
  unread: {
    backgroundColor: "rgba(220, 200, 220, 0.1)",
  },
  message: {
    fontSize: theme.typography.body2.fontSize,
  },
  content: {
    marginLeft: theme.spacing(2), // Add spacing between avatar and content
    flexGrow: 1, // Allow content to grow and occupy remaining space
  },
  time: {
    fontSize: theme.typography.caption.fontSize,
  },
  avatar: {
    width: theme.spacing(10), // Adjust avatar size
    height: theme.spacing(10), // Adjust avatar size
  },
}));

const NotificationItem = ({ notification, onClick }) => {
  const classes = useStyles();

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
    <div
      className={`${classes.notificationItem} ${
        notification.is_read ? "" : classes.unread
      }`}
      onClick={onClick}
    >
      <Avatar
        alt={getDisplayName()}
        src={getDisplayAvatar()}
        className={classes.avatar}
      />
      <div className={classes.content}>
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          {notification.notification_type === "linkup_request" ? (
            <>
              <span>{notification.requester_name}</span>
              <span> wants to link up with you!</span>
            </>
          ) : notification.notification_type === "linkup_request_action" ? (
            <>
              <span>{notification.receiver_name}</span>
              <span> accepted your link-up request!</span>
            </>
          ) : (
            <>
              <span>{notification.requester_name}</span>
              <span> sent you a new message:</span>
              <span className={classes.message}> {notification.content}</span>
            </>
          )}
        </Typography>
        <Typography variant="body2" className={classes.message}>
          {notification.notification_type === "linkup_request" ? (
            <span>Message: {notification.message}</span>
          ) : (
            <></>
          )}
        </Typography>
        <Typography variant="caption" className={classes.time}>
          {getTimeAgo()}
        </Typography>
      </div>
    </div>
  );
};

export default NotificationItem;
