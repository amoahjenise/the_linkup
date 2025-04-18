import React, { createContext, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { useSnackbar } from "./SnackbarContext";
import { incrementUnreadNotificationsCount } from "../redux/actions/notificationActions";
import { showNewLinkupButton } from "../redux/actions/linkupActions";
import {
  requestNotificationPermission,
  showNotification,
} from "../utils/notificationUtils";
import { calculateDistance, calculateAge } from "../utils/utils";
import { customGenderOptions } from "../utils/customGenderOptions";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();

  const user = useSelector((state) => state.loggedUser?.user);
  const userSettings = useSelector((state) => state.userSettings.userSettings);

  const userId = user?.id;
  const userLat = user?.latitude;
  const userLng = user?.longitude;
  const userGender = user?.gender;

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const LINKUP_MANAGEMENT_SOCKET_NAMESPACE =
    process.env.REACT_APP_LINKUP_MANAGEMENT_SOCKET_NAMESPACE ||
    "/linkup-management";
  const LINKUP_REQUEST_SOCKET_NAMESPACE =
    process.env.REACT_APP_LINKUP_REQUEST_SOCKET_NAMESPACE || "/linkup-request";

  const linkupManagementSocket = useMemo(() => {
    if (!userId) return null;
    return io(`${BASE_URL}${LINKUP_MANAGEMENT_SOCKET_NAMESPACE}`, {
      query: { userId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }, [BASE_URL, LINKUP_MANAGEMENT_SOCKET_NAMESPACE, userId]);

  const linkupRequestSocket = useMemo(() => {
    if (!userId) return null;
    return io(`${BASE_URL}${LINKUP_REQUEST_SOCKET_NAMESPACE}`, {
      query: { userId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }, [BASE_URL, LINKUP_REQUEST_SOCKET_NAMESPACE, userId]);

  useEffect(() => {
    if (!linkupManagementSocket || !linkupRequestSocket) return;

    const isLinkupWithinUserSettings = (linkup) => {
      const ageRange = userSettings?.ageRange || [18, 99];
      const distanceRange = userSettings?.distanceRange || [0, 50];
      const genderPreferences = userSettings?.genderPreferences || [
        "men",
        "women",
        ...customGenderOptions.map((g) => g.toLowerCase()),
      ];

      const distance = calculateDistance(
        userLat,
        userLng,
        linkup.latitude,
        linkup.longitude
      );
      if (distance < distanceRange[0] || distance > distanceRange[1])
        return false;

      const age = calculateAge(linkup.date_of_birth) || 0;
      if (age < ageRange[0] || age > ageRange[1]) return false;

      if (
        genderPreferences.length > 0 &&
        !genderPreferences.includes(linkup.creator_gender?.toLowerCase())
      ) {
        return false;
      }

      return true;
    };

    const handleLinkupCreated = ({ linkup }) => {
      if (
        linkup.creator_id === userId ||
        !linkup.gender_preference.includes(userGender) ||
        !isLinkupWithinUserSettings(linkup)
      ) {
        return;
      }
      dispatch(showNewLinkupButton(true));
    };

    const handleLinkupUpdated = ({ linkup }) => {
      if (linkup.creator_id === userId || !isLinkupWithinUserSettings(linkup)) {
        return;
      }
      dispatch(showNewLinkupButton(true));
    };

    const handleLinkupDeleted = ({ linkup }) => {
      if (
        linkup.creator_id === userId ||
        !linkup.gender_preference.includes(userGender) ||
        !isLinkupWithinUserSettings(linkup)
      ) {
        return;
      }
      dispatch(showNewLinkupButton(true));
    };

    const handleLinkupExpired = ({ message }) => {
      addSnackbar(message, { timeout: 7000 });
      showNotification("Linkup Expired", message);
      dispatch(showNewLinkupButton(true));
    };

    const handleNotification = (type, notification) => {
      addSnackbar(notification.content, { timeout: 7000 });
      dispatch(incrementUnreadNotificationsCount());
      showNotification(type, notification.content);
    };

    if (Notification.permission === "default") {
      requestNotificationPermission();
    }

    if (process.env.NODE_ENV === "development") {
      linkupManagementSocket.on("connect", () =>
        console.log("Management socket connected")
      );
      linkupManagementSocket.on("disconnect", () =>
        console.log("Management socket disconnected")
      );
      linkupRequestSocket.on("connect", () =>
        console.log("Request socket connected")
      );
      linkupRequestSocket.on("disconnect", () =>
        console.log("Request socket disconnected")
      );
    }

    // Attach listeners
    linkupManagementSocket.on("linkupCreated", handleLinkupCreated);
    linkupManagementSocket.on("linkupUpdated", handleLinkupUpdated);
    linkupManagementSocket.on("linkupDeleted", handleLinkupDeleted);
    linkupManagementSocket.on("linkupExpired", handleLinkupExpired);

    linkupRequestSocket.on("new-linkup-request", (data) =>
      handleNotification("New Linkup Request", data)
    );
    linkupRequestSocket.on("request-accepted", (data) =>
      handleNotification("Request Accepted", data)
    );
    linkupRequestSocket.on("request-declined", (data) =>
      handleNotification("Request Declined", data)
    );

    return () => {
      linkupManagementSocket.off("linkupCreated", handleLinkupCreated);
      linkupManagementSocket.off("linkupUpdated", handleLinkupUpdated);
      linkupManagementSocket.off("linkupDeleted", handleLinkupDeleted);
      linkupManagementSocket.off("linkupExpired", handleLinkupExpired);

      linkupRequestSocket.off("new-linkup-request");
      linkupRequestSocket.off("request-accepted");
      linkupRequestSocket.off("request-declined");

      if (process.env.NODE_ENV === "development") {
        linkupManagementSocket.off("connect");
        linkupManagementSocket.off("disconnect");
        linkupRequestSocket.off("connect");
        linkupRequestSocket.off("disconnect");
      }
    };
  }, [
    userId,
    userLat,
    userLng,
    userGender,
    userSettings,
    addSnackbar,
    dispatch,
    linkupManagementSocket,
    linkupRequestSocket,
  ]);

  const sockets = useMemo(
    () => ({ linkupManagementSocket, linkupRequestSocket }),
    [linkupManagementSocket, linkupRequestSocket]
  );

  return (
    <SocketContext.Provider value={sockets}>{children}</SocketContext.Provider>
  );
};

export const useSockets = () => {
  const context = React.useContext(SocketContext);
  if (!context)
    throw new Error("useSockets must be used within a SocketProvider");
  return context;
};
