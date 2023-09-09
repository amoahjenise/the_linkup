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
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

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

  const handleNotificationClick = async (notification) => {
    if (notification.notification_type === "linkup_request") {
      try {
        if (notification.is_read === false) {
          markNotificationAsRead(notification.id);
          dispatch(
            updateUnreadNotificationsCount(unreadNotificationsCount - 1)
          );
        }
        navigate("/history/requests-received");
      } catch (error) {
        console.log("Error marking notification as read:", error);
      }
    }
  };

  return (
    <div className={classes.mainContainer}>
      <TopNavBar title="Notifications" />
      {isLoading ? (
        <LoadingSpinner marginTop="350px" />
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
