import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import NotificationItem from "./NotificationItem";
import { setMessagesData } from "../redux/actions/conversationActions";
import {
  markNotificationAsRead,
  getUnreadNotifications,
} from "../api/notificationAPI";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  notificationsContainer: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    width: "100%",
  },
  notificationsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
}));

const Notifications = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedUser = useSelector((state) => state.loggedUser);
  const { id } = loggedUser?.user || {};
  const [notifications, setNotifications] = useState([]);

  const fetchUnreadNotifications = useCallback(async () => {
    try {
      const response = await getUnreadNotifications(id);
      setNotifications(response);
    } catch (error) {
      console.log("Error fetching unread notifications:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchUnreadNotifications();
  }, [fetchUnreadNotifications]);

  const handleNotificationClick = async (notification) => {
    if (notification.type === "link_up_request") {
      try {
        dispatch(
          setMessagesData(
            [notification.user_id, notification.requester_id],
            notification.message,
            notification.id,
            notification.link_up_id
          )
        );
        navigate(`/messages/${notification.link_up_id}`);
      } catch (error) {
        console.log("Error marking notification as read:", error);
      }
    }
  };

  return (
    <div className={classes.notificationsContainer}>
      <ul className={classes.notificationsList}>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={() => handleNotificationClick(notification)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
