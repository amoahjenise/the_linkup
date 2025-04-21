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
import { useBadge } from "../utils/badgeUtils"; // Updated import to use the hook

// Styled components (unchanged)
const MainContainer = styled("div")(({ theme, colorMode }) => ({
  display: "flex",
  flexDirection: "column",
  overflowY: "hidden",
  width: "100%",
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

const Notifications = ({ isMobile, colorMode }) => {
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

  // Use the badge hook
  const { updateBadge } = useBadge();

  // Fetch notifications
  const fetchUnreadNotifications = useCallback(async () => {
    try {
      const response = await getNotifications(id);
      setNotifications(response);
    } catch (error) {
      console.log("Error fetching unread notifications:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [id]);

  // Initial load and badge clear
  useEffect(() => {
    const initialize = async () => {
      await fetchUnreadNotifications();
      // Always clear badge when entering notifications page
      // await updateBadge(0);
    };
    initialize();
  }, [fetchUnreadNotifications, updateBadge]);

  // Handle unread count changes
  useEffect(() => {
    if (unreadNotificationsCount !== unreadCountChanged) {
      fetchUnreadNotifications();
      setUnreadCountChanged(unreadNotificationsCount);
    }
  }, [unreadNotificationsCount, fetchUnreadNotifications, unreadCountChanged]);

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
    <MainContainer colorMode={colorMode}>
      <TopNavBar title="Notifications" />
      {isLoading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <NoNotificationsContainer>
          <EmptyNotificationsPlaceholder />
        </NoNotificationsContainer>
      ) : (
        <div
          style={{
            height: "100%",
            overflowY: "auto",
            paddingBottom: isMobile ? "65px" : 0, // Secondary fallback
          }}
        >
          <NotificationsList>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  marginBottom: 8,
                }}
              >
                <MemoizedNotificationItem
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              </div>
            ))}
          </NotificationsList>
        </div>
      )}
    </MainContainer>
  );
};

export default Notifications;
