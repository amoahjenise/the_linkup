import React, { createContext, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { useSnackbar } from "./SnackbarContext";
import { incrementUnreadNotificationsCount } from "../redux/actions/notificationActions";
import {
  requestNotificationPermission,
  showNotification,
} from "../utils/notificationUtils";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;

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
    requestNotificationPermission(); // Request notification permission on mount

    linkupManagementSocket.on("linkupCreated", (newLinkup) => {
      // Handle new linkup created
    });

    linkupManagementSocket.on("linkupExpired", (data) => {
      addSnackbar(data.message, { timeout: 7000 });
      showNotification("Linkup Expired", data.message);
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
