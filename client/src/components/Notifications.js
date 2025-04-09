import React, { useCallback, useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import NotificationItem from "./NotificationItem";
import LoadingSpinner from "./LoadingSpinner";
import { updateUnreadNotificationsCount } from "../redux/actions/notificationActions";
import {
  markNotificationAsRead,
  getNotifications,
} from "../api/notificationAPI";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import EmptyNotificationsPlaceholder from "./EmptyNotificationsPlaceholder";
import { updateAppBadge } from "../utils/badgeUtils"; // Import your badge utility

// Styled components
const MainContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  overflowY: "hidden",
  width: "100%",
  height: "100dvh",
}));

const NotificationsList = styled("ul")(({ theme }) => ({
  overflowY: "auto",
  listStyle: "none",
  margin: 0,
  flexGrow: 1,
  padding: theme.spacing(2),
}));

const NoNotificationsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const MemoizedNotificationItem = memo(NotificationItem);

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
  const [isUpdatingBadge, setIsUpdatingBadge] = useState(false);

  // Badge update handler using the utility
  const updateBadge = useCallback(async (count) => {
    if (typeof count !== "number") return;

    setIsUpdatingBadge(true);
    try {
      const success = await updateAppBadge(count);

      if (!success && navigator.serviceWorker) {
        const sw = await navigator.serviceWorker.ready;
        await sw.active?.postMessage({
          type: count > 0 ? "UPDATE_BADGE" : "CLEAR_BADGE",
          count: count,
        });
      }
    } catch (error) {
      console.error("Badge update error:", error);
    } finally {
      setIsUpdatingBadge(false);
    }
  }, []);

  // Fetch notifications
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

  // Initial load and badge clear
  useEffect(() => {
    const initialize = async () => {
      await fetchUnreadNotifications();
      if (unreadNotificationsCount > 0) {
        await updateBadge(0);
      }
    };
    initialize();
  }, [fetchUnreadNotifications, unreadNotificationsCount, updateBadge]);

  // Handle unread count changes
  useEffect(() => {
    const handleCountChange = async () => {
      if (unreadNotificationsCount !== unreadCountChanged) {
        await fetchUnreadNotifications();
        setUnreadCountChanged(unreadNotificationsCount);
        await updateBadge(unreadNotificationsCount);
      }
    };
    handleCountChange();
  }, [
    unreadNotificationsCount,
    fetchUnreadNotifications,
    unreadCountChanged,
    updateBadge,
  ]);

  // Handle notification clicks
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        await markNotificationAsRead(notification.id);
        const newCount = unreadNotificationsCount - 1;
        dispatch(updateUnreadNotificationsCount(newCount));
        await updateBadge(newCount);
      }

      // Navigation logic
      switch (notification.notification_type) {
        case "linkup_request":
        case "new_message":
          navigate("/messages");
          break;
        case "linkup_request_action":
          navigate("/history/requests-sent");
          break;
        default:
          break;
      }
    } catch (error) {
      console.log("Error handling notification:", error);
    }
  };

  return (
    <MainContainer>
      <TopNavBar title="Notifications" />
      {isLoading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <NoNotificationsContainer>
          <EmptyNotificationsPlaceholder />
        </NoNotificationsContainer>
      ) : (
        <NotificationsList>
          {notifications.map((notification) => (
            <div key={notification.id} style={{ marginBottom: 8 }}>
              <MemoizedNotificationItem
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
              />
            </div>
          ))}
        </NotificationsList>
      )}
    </MainContainer>
  );
};

export default Notifications;
