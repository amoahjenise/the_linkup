import React, { createContext, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { useSnackbar } from "./SnackbarContext";
import { incrementUnreadNotificationsCount } from "../redux/actions/notificationActions";
import {
  requestNotificationPermission,
  showNotification,
} from "../utils/notificationUtils";
import { showNewLinkupButton } from "../redux/actions/linkupActions";
import { calculateDistance, calculateAge } from "../utils/utils";
import { customGenderOptions } from "../utils/customGenderOptions";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;
  const userGender = loggedUser?.user?.gender;
  const userSettings = useSelector((state) => state.userSettings.userSettings);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const LINKUP_MANAGEMENT_SOCKET_NAMESPACE =
    process.env.REACT_APP_LINKUP_MANAGEMENT_SOCKET_NAMESPACE ||
    "/linkup-management";
  const LINKUP_REQUEST_SOCKET_NAMESPACE =
    process.env.REACT_APP_LINKUP_REQUEST_SOCKET_NAMESPACE || "/linkup-request";

  // Create Socket.IO instances using useMemo
  const linkupManagementSocket = useMemo(
    () =>
      io(`${BASE_URL}${LINKUP_MANAGEMENT_SOCKET_NAMESPACE}`, {
        query: { userId },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      }),
    [BASE_URL, LINKUP_MANAGEMENT_SOCKET_NAMESPACE, userId]
  );

  const linkupRequestSocket = useMemo(
    () =>
      io(`${BASE_URL}${LINKUP_REQUEST_SOCKET_NAMESPACE}`, {
        query: { userId },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      }),
    [BASE_URL, LINKUP_REQUEST_SOCKET_NAMESPACE, userId]
  );

  useEffect(() => {
    const isLinkupWithinUserSettings = (linkup) => {
      if (!loggedUser) return false;

      // Get current settings from Redux store directly
      const currentSettings = userSettings || {};
      const ageRange = currentSettings.ageRange || [18, 99];
      const distanceRange = currentSettings.distanceRange || [0, 50];
      const genderPreferences = currentSettings.genderPreferences || [
        "men",
        "women",
        ...customGenderOptions.map((g) => g.toLowerCase()),
      ];

      // Distance filter
      const distance = calculateDistance(
        loggedUser.user.latitude,
        loggedUser.user.longitude,
        linkup.latitude,
        linkup.longitude
      );
      if (distance < distanceRange[0] || distance > distanceRange[1]) {
        return false;
      }

      // Age filter
      const age = calculateAge(linkup.date_of_birth) || 0;
      if (age < ageRange[0] || age > ageRange[1]) {
        return false;
      }

      // Gender filter
      if (
        genderPreferences.length > 0 &&
        !genderPreferences.includes(linkup.creator_gender?.toLowerCase())
      ) {
        return false;
      }

      return true;
    };

    const handleLinkupCreated = (data) => {
      if (
        data.linkup.creator_id === userId ||
        !data.linkup.gender_preference.includes(userGender) ||
        !isLinkupWithinUserSettings(data.linkup)
      ) {
        return;
      }
      dispatch(showNewLinkupButton(true));
    };

    const handleLinkupUpdated = (data) => {
      if (data.linkup.creator_id === userId || !isLinkupWithinUserSettings(data.linkup)) {
        return;
      }
      dispatch(showNewLinkupButton(true));
    };

    const handleLinkupDeleted = (data) => {
      if (
        data.linkup.creator_id === userId ||
        !data.linkup.gender_preference.includes(userGender) ||
        !isLinkupWithinUserSettings(data.linkup)
      ) {
        return;
      }
      dispatch(showNewLinkupButton(true));
    };

    const handleLinkupExpired = (data) => {
      addSnackbar(data.message, { timeout: 7000 });
      showNotification("Linkup Expired", data.message);
      dispatch(showNewLinkupButton(true));
    };

    const handleNewLinkupRequest = (notification) => {
      addSnackbar(notification.content, { timeout: 7000 });
      dispatch(incrementUnreadNotificationsCount());
      showNotification("New Linkup Request", notification.content);
    };

    const handleRequestAccepted = (notification) => {
      addSnackbar(notification.content, { timeout: 7000 });
      dispatch(incrementUnreadNotificationsCount());
      showNotification("Request Accepted", notification.content);
    };

    const handleRequestDeclined = (notification) => {
      addSnackbar(notification.content, { timeout: 7000 });
      dispatch(incrementUnreadNotificationsCount());
      showNotification("Request Declined", notification.content);
    };

    // Request notification permission only if not already granted
    if (Notification.permission === "default") {
      requestNotificationPermission();
    }

    // Add debug listeners
    if (process.env.NODE_ENV === "development") {
      linkupManagementSocket.on("connect", () => console.log("Management socket connected"));
      linkupManagementSocket.on("disconnect", () => console.log("Management socket disconnected"));
      linkupRequestSocket.on("connect", () => console.log("Request socket connected"));
      linkupRequestSocket.on("disconnect", () => console.log("Request socket disconnected"));
    }

    // Set up event listeners
    linkupManagementSocket.on("linkupCreated", handleLinkupCreated);
    linkupManagementSocket.on("linkupUpdated", handleLinkupUpdated);
    linkupManagementSocket.on("linkupDeleted", handleLinkupDeleted);
    linkupManagementSocket.on("linkupExpired", handleLinkupExpired);

    linkupRequestSocket.on("new-linkup-request", handleNewLinkupRequest);
    linkupRequestSocket.on("request-accepted", handleRequestAccepted);
    linkupRequestSocket.on("request-declined", handleRequestDeclined);

    return () => {
      // Clean up event listeners
      linkupManagementSocket.off("linkupCreated", handleLinkupCreated);
      linkupManagementSocket.off("linkupUpdated", handleLinkupUpdated);
      linkupManagementSocket.off("linkupDeleted", handleLinkupDeleted);
      linkupManagementSocket.off("linkupExpired", handleLinkupExpired);

      linkupRequestSocket.off("new-linkup-request", handleNewLinkupRequest);
      linkupRequestSocket.off("request-accepted", handleRequestAccepted);
      linkupRequestSocket.off("request-declined", handleRequestDeclined);

      // Remove debug listeners
      if (process.env.NODE_ENV === "development") {
        linkupManagementSocket.off("connect");
        linkupManagementSocket.off("disconnect");
        linkupRequestSocket.off("connect");
        linkupRequestSocket.off("disconnect");
      }
    };
  }, [
    addSnackbar,
    dispatch,
    userId,
    userGender,
    linkupManagementSocket,
    linkupRequestSocket,
    loggedUser, // Only needed for initial check
  ]);

  const sockets = useMemo(
    () => ({
      linkupManagementSocket,
      linkupRequestSocket,
    }),
    [linkupManagementSocket, linkupRequestSocket]
  );

  return (
    <SocketContext.Provider value={sockets}>{children}</SocketContext.Provider>
  );
};

export const useSockets = () => {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSockets must be used within a SocketProvider");
  }
  return context;
};