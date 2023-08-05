import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import NotificationItem from "./NotificationItem";
import {
  getUnreadNotifications,
  markNotificationAsRead,
} from "../api/notificationAPI";

const useStyles = makeStyles((theme) => ({
  notificationsContainer: {
    position: "relative",
    width: "100%",
  },
  notificationsBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    borderRadius: "50%",
    width: 20,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
  notificationsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
}));

const Notifications = () => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await getUnreadNotifications();
      setNotifications(response);
      setUnreadCount(response.length);
    } catch (error) {
      console.log("Error fetching unread notifications:", error);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      fetchUnreadNotifications();
      // Redirect the user to the message or conversation related to the notification
      // ...
    } catch (error) {
      console.log("Error marking notification as read:", error);
    }
  };

  return (
    <div className={classes.notificationsContainer}>
      {unreadCount > 0 && (
        <div className={classes.notificationsBadge}>{unreadCount}</div>
      )}
      <ul className={classes.notificationsList}>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={() => handleNotificationClick(notification.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
