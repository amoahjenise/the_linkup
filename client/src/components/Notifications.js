import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import NotificationItem from "./NotificationItem";
import LoadingSpinner from "./LoadingSpinner"; // Import the LoadingSpinner component
import { updateUnreadNotificationsCount } from "../redux/actions/notificationActions";
import {
  markNotificationAsRead,
  getNotifications,
} from "../api/notificationAPI";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import { Typography } from "@material-ui/core";
import { NotificationsNoneOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    overflowY: "hidden",
    width: "100%",
  },
  notificationsList: {
    overflowY: "auto",
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  noNotificationsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh", // Adjust height as needed
  },
  noNotificationsText: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    // color: "#666",
    textAlign: "center",
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "rgba(200, 200, 200, 0.2)", // Change to your desired darker color
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
  },
}));

const Notifications = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unreadNotificationsCount = useSelector(
    (state) => state.notifications.unreadCount
  );
  const loggedUser = useSelector((state) => state.loggedUser);
  const { id } = loggedUser?.user || {};
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCountChanged, setUnreadCountChanged] = useState(0);

  const fetchUnreadNotifications = useCallback(async () => {
    try {
      const response = await getNotifications(id);
      setNotifications(response);
    } catch (error) {
      console.log("Error fetching unread notifications:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [id]);

  useEffect(() => {
    fetchUnreadNotifications();
  }, [fetchUnreadNotifications]);

  useEffect(() => {
    if (unreadNotificationsCount !== unreadCountChanged) {
      fetchUnreadNotifications();
      setUnreadCountChanged(unreadNotificationsCount);
    }
  }, [unreadNotificationsCount, fetchUnreadNotifications, unreadCountChanged]);

  const handleNotificationClick = async (notification) => {
    try {
      if (notification.is_read === false) {
        markNotificationAsRead(notification.id);
        dispatch(updateUnreadNotificationsCount(unreadNotificationsCount - 1));
      }

      if (notification.notification_type === "linkup_request") {
        navigate("/history/requests-received");
      } else if (notification.notification_type === "linkup_request_action") {
        navigate("/history/requests-sent");
      } else if (notification.notification_type === "new_message") {
        navigate("/messages");
      }
    } catch (error) {
      console.log("Error marking notification as read:", error);
    }
  };

  return (
    <div className={classes.mainContainer}>
      <TopNavBar title="Notifications" />
      {isLoading ? (
        <LoadingSpinner marginTop="350px" />
      ) : notifications.length === 0 ? ( // Check if notifications array is empty
        <div className={classes.noNotificationsContainer}>
          <Typography variant="body1" className={classes.noNotificationsText}>
            <NotificationsNoneOutlined className={classes.icon} />
            No notifications to show here
          </Typography>
        </div>
      ) : (
        <ul className={classes.notificationsList}>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
