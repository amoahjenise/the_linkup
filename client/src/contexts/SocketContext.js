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
import { calculateDistance, calculateAge } from "../utils/utils"; // Utility functions for distance and age
import { customGenderOptions } from "../utils/customGenderOptions"; // Import the reusable gender options

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;
  const userGender = loggedUser?.user?.gender;
  const userSettings = useSelector((state) => state.userSettings.userSettings); // Get user settings from Redux store

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
      }),
    [BASE_URL, LINKUP_MANAGEMENT_SOCKET_NAMESPACE, userId]
  );

  const linkupRequestSocket = useMemo(
    () =>
      io(`${BASE_URL}${LINKUP_REQUEST_SOCKET_NAMESPACE}`, {
        query: { userId },
      }),
    [BASE_URL, LINKUP_REQUEST_SOCKET_NAMESPACE, userId]
  );

  useEffect(() => {
    const isLinkupWithinUserSettings = (linkup) => {
      if (!loggedUser) return false;

      // Use default values if userSettings is missing or incomplete
      const ageRange = userSettings?.ageRange || [18, 99];
      const distanceRange = userSettings?.distanceRange || [0, 50];
      const genderRange =
        userSettings?.genderRange?.length > 0
          ? userSettings.genderRange
          : [
              { key: "men", value: "Men" },
              { key: "women", value: "Women" },
              ...customGenderOptions.map((gender) => ({
                key: gender.toLowerCase(),
                value: gender,
              })),
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
        genderRange.length > 0 &&
        !genderRange.some((g) => g.key === linkup.creator_gender)
      ) {
        return false;
      }

      return true;
    };

    requestNotificationPermission(); // Request notification permission on mount

    linkupManagementSocket.on("linkupCreated", (data) => {
      // Check if the linkup matches the user's settings
      if (
        data.linkup.creator_id === userId || // Skip if the user created the linkup
        !data.linkup.gender_preference.includes(userGender) || // Skip if gender preference doesn't match
        !isLinkupWithinUserSettings(data.linkup) // Skip if linkup doesn't match user settings
      ) {
        return;
      }

      dispatch(showNewLinkupButton(true)); // Dispatch action to show the NewLinkupButton
    });

    linkupManagementSocket.on("linkupUpdated", (data) => {
      if (data.linkup.creator_id === userId) return; // Skip if the user updated the linkup
      if (!isLinkupWithinUserSettings(data.linkup)) return; // Skip if linkup doesn't match user settings

      dispatch(showNewLinkupButton(true)); // Dispatch action to show the NewLinkupButton
    });

    linkupManagementSocket.on("linkupDeleted", (data) => {
      if (
        data.linkup.creator_id === userId || // Skip if the user deleted the linkup
        !data.linkup.gender_preference.includes(userGender) || // Skip if gender preference doesn't match
        !isLinkupWithinUserSettings(data.linkup) // Skip if linkup doesn't match user settings
      ) {
        return;
      }

      dispatch(showNewLinkupButton(true)); // Dispatch action to show the NewLinkupButton
    });

    linkupManagementSocket.on("linkupExpired", (data) => {
      addSnackbar(data.message, { timeout: 7000 });
      showNotification("Linkup Expired", data.message);
      dispatch(showNewLinkupButton(true)); // Dispatch action to show the NewLinkupButton
    });

    linkupRequestSocket.on("new-linkup-request", (notification) => {
      addSnackbar(notification.content, { timeout: 7000 });
      dispatch(incrementUnreadNotificationsCount());
      showNotification("New Linkup Request", notification.content);
    });

    linkupRequestSocket.on("request-accepted", (notification) => {
      addSnackbar(notification.content, { timeout: 7000 });
      dispatch(incrementUnreadNotificationsCount());
      showNotification("Request Accepted", notification.content);
    });

    linkupRequestSocket.on("request-declined", (notification) => {
      addSnackbar(notification.content, { timeout: 7000 });
      dispatch(incrementUnreadNotificationsCount());
      showNotification("Request Declined", notification.content);
    });

    return () => {
      linkupManagementSocket.disconnect();
      linkupRequestSocket.disconnect();
      if (process.env.NODE_ENV === "development") {
        console.log("Client side disconnected from sockets.");
      }
    };
  }, [
    addSnackbar,
    dispatch,
    userId,
    userGender,
    userSettings,
    linkupManagementSocket,
    linkupRequestSocket,
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
