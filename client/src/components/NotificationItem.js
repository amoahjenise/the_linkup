import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  notificationItem: {
    alignItems: "center",
    padding: theme.spacing(2),
    borderTop: "1px solid #e1e8ed",
    borderBottom: "1px solid #e1e8ed",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out", // Added transition for smooth effect
    "&:hover": {
      backgroundColor: "#F5F8FA", // Change the background color on hover
    },
  },
  unread: {
    backgroundColor: "#F5F8FA",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  messageContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  message: {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.text.secondary,
  },
  time: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.palette.text.secondary,
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

  return (
    <div
      className={`${classes.notificationItem} ${
        notification.is_read ? "" : classes.unread
      }`}
      onClick={onClick}
    >
      <Avatar
        alt={notification.requester_name}
        src={notification.requester_avatar}
        className={classes.avatar}
      />

      <div className={classes.content}>
        <Typography variant="subtitle1">{notification.content}</Typography>
        <div className={classes.messageContainer}>
          <Typography variant="caption" className={classes.message}>
            {notification.message}
          </Typography>
          <Typography component="small" className={classes.time}>
            {getTimeAgo()}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
