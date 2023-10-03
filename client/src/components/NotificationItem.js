import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  notificationItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "120px", // Set a fixed height for each notification item
    padding: theme.spacing(2),
    borderTop: "1px solid #e1e8ed",
    borderBottom: "1px solid #e1e8ed",
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
  time: {
    fontSize: theme.typography.caption.fontSize,
    marginLeft: "auto",
  },
}));

const NotificationItem = ({ notification, onClick }) => {
  const classes = useStyles();
  const { colorMode } = useColorMode();

  const filterStyle =
    colorMode === "dark" ? "invert(0.879) grayscale(70%)" : "none";

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
      // Add more cases for other notification types if needed
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
      // Add more cases for other notification types if needed
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
      <div>
        <div className={classes.avatarContainer}>
          <Avatar alt={getDisplayName()} src={getDisplayAvatar()} />
          <Typography variant="subtitle1">{notification.content}</Typography>
        </div>
        <div>
          {notification.notification_type === "linkup_request" && (
            <Typography variant="caption" className={classes.message}>
              <span>Message: {notification.message}</span>
            </Typography>
          )}
        </div>
      </div>
      <div className={classes.time}>
        <Typography component="small">
          <span>{getTimeAgo()}</span>
        </Typography>
      </div>
    </div>
  );
};

export default NotificationItem;
