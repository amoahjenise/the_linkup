import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  notificationItem: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
  },
}));

const NotificationItem = ({ notification }) => {
  const classes = useStyles();

  const { sender, notificationText, createdAt } = notification;

  const getTimeAgo = () => {
    const now = moment();
    const created = moment(createdAt);
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
    <div className={classes.notificationItem}>
      <Avatar
        alt={sender.username}
        src={sender.avatar}
        className={classes.avatar}
      />
      <div className={classes.content}>
        <Typography variant="subtitle1">{sender.username}</Typography>
        <Typography variant="body2">{notificationText}</Typography>
        <Typography variant="caption">{getTimeAgo()}</Typography>
      </div>
    </div>
  );
};

export default NotificationItem;
