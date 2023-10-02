import React, { createContext, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { useSnackbar } from "./contexts/SnackbarContext";
import { useDispatch } from "react-redux";
import { incrementUnreadNotificationsCount } from "./redux/actions/notificationActions";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser.user.id;

  // Create Socket.IO instances for both services
  const linkupManagementSocket = io("http://localhost:3003", {
    query: { userId },
  });

  const linkupRequestSocket = io("http://localhost:3004", {
    query: { userId },
  });

  useEffect(() => {
    console.log(`Client side user ${userId} connected to linkupRequestSocket.`);

    // Linkup Management Service Events

    linkupManagementSocket.on("linkupCreated", (newLinkup) => {
      addSnackbar(
        `Linkup ${newLinkup.id} created in Linkup Management Service.`
      );
    });

    linkupManagementSocket.on("linkupExpired", (expiredLinkup) => {
      addSnackbar(`Linkup ${expiredLinkup.linkupId} has expired!`);
    });

    // Linkup Request Service Events

    linkupRequestSocket.on("new-linkup-request", (notification) => {
      addSnackbar(notification.content, { timeout: 7000 });
      dispatch(incrementUnreadNotificationsCount());
    });

    linkupRequestSocket.on("request-accepted", (notification) => {
      addSnackbar(notification.content, { timeout: 7000 });

      dispatch(incrementUnreadNotificationsCount());
    });

    linkupRequestSocket.on("request-declined", (notification) => {
      addSnackbar(notification.content, { timeout: 7000 });
      dispatch(incrementUnreadNotificationsCount());
    });

    // Cleanup function to disconnect the sockets when the component unmounts
    return () => {
      linkupManagementSocket.disconnect();
      linkupRequestSocket.disconnect();
      console.log("Client side disconnected from sockets.");
    };
  }, [addSnackbar, linkupManagementSocket, linkupRequestSocket, userId]);

  const sockets = {
    linkupManagementSocket,
    linkupRequestSocket,
  };

  return (
    <SocketContext.Provider value={sockets}>{children}</SocketContext.Provider>
  );
};

export const useSockets = () => {
  return useContext(SocketContext);
};
