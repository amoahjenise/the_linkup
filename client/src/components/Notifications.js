import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import NotificationItem from "./NotificationItem";
import LoadingSpinner from "./LoadingSpinner"; // Import the LoadingSpinner component
import { updateUnreadNotificationsCount } from "../redux/actions/notificationActions";
import {
  markNotificationAsRead,
  getNotifications,
} from "../api/notificationAPI";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import { Typography } from "@mui/material";
import EmptyNotificationsPlaceholder from "./EmptyNotificationsPlaceholder";

// Define styled components
const MainContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  overflowY: "hidden",
  width: "100%",
}));

const NotificationsList = styled("ul")({
  overflowY: "auto",
  listStyle: "none",
  padding: 0,
  margin: 0,
});

const NoNotificationsContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const Notifications = () => {
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
        navigate("/messages");
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
    <MainContainer>
      <TopNavBar title="Notifications" />
      {isLoading ? (
        <LoadingSpinner marginTop="350px" />
      ) : notifications.length === 0 ? ( // Check if notifications array is empty
        <NoNotificationsContainer>
          <EmptyNotificationsPlaceholder />
        </NoNotificationsContainer>
      ) : (
        <NotificationsList>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification)}
            />
          ))}
        </NotificationsList>
      )}
    </MainContainer>
  );
};

export default Notifications;
