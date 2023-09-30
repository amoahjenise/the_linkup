import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import logo from "../logo.png";
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  logo: {
    height: "40px",
  },
  avatarContainer: {
    display: "flex",
    alignItems: "center",
  },
  notificationItem: {
    alignItems: "center",
    padding: theme.spacing(2),
    borderTop: "1px solid #e1e8ed",
    borderBottom: "1px solid #e1e8ed",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out", // Added transition for smooth effect
    "&:hover": {
      backgroundColor: "rgba(200, 200, 200, 0.1)",
    },
  },
  unread: {
    backgroundColor: "rgba(220, 200, 220, 0.1)",
  },
  avatar: {
    marginLeft: theme.spacing(2),
  },
  content: {
    marginLeft: theme.spacing(8),
  },
  messageContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  message: {
    fontSize: theme.typography.body2.fontSize,
  },
  time: {
    fontSize: theme.typography.caption.fontSize,
  },
}));

const NotificationItem = ({ notification, onClick }) => {
  const classes = useStyles();
  const { colorMode } = useColorMode();

  const filterStyle =
    colorMode === "dark" ? "invert(0.879) grayscale(70%)" : "none"; // Set filter style based on colorMode

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

  return (
    <div
      className={`${classes.notificationItem} ${
        notification.is_read ? "" : classes.unread
      }`}
      onClick={onClick}
    >
      <div className={classes.avatarContainer}>
        {notification.notification_type === "linkup_request" ? (
          <img
            src={logo}
            alt="Logo"
            className={classes.logo}
            style={{ filter: filterStyle }}
          />
        ) : (
          <img src="" alt="Logo" className={classes.logo} />
        )}
        <Avatar
          alt={notification.requester_name}
          src={notification.requester_avatar}
          className={classes.avatar}
        />
      </div>

      <div className={classes.content}>
        <Typography variant="subtitle1">{notification.content}</Typography>
        <div className={classes.messageContainer}>
          <Typography variant="caption" className={classes.message}>
            <span>{notification.message}</span>
          </Typography>
          <Typography component="small" className={classes.time}>
            <span>{getTimeAgo()}</span>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
