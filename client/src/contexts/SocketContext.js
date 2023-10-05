import React, { createContext, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { useSnackbar } from "./SnackbarContext";
import { useDispatch } from "react-redux";
import { incrementUnreadNotificationsCount } from "../redux/actions/notificationActions";
import { newMessage } from "../redux/actions/conversationActions";

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

  const messagingSocket = io("http://localhost:3006", {
    query: { userId },
  });

  useEffect(() => {
    console.log(`Client side user ${userId} connected to linkupRequestSocket.`);

    // Function to authenticate the user with the sockets
    const authenticateUser = (socket) => {
      socket.emit("authenticate", userId);
    };

    // Authenticate users with their respective sockets
    // authenticateUser(linkupManagementSocket);
    // authenticateUser(linkupRequestSocket);
    authenticateUser(messagingSocket);

    // Messaging Service Events

    // Add a listener for the "new-message" event
    messagingSocket.on("new-message", (data) => {
      // Data contains the incoming message details, e.g., sender_id, message_content, conversation_id
      const {
        timestamp,
        message_content,
        sender_name,
        sender_avatar,
        conversation_id,
      } = data;

      // Dispatch the newMessage action to update the Redux store for both sender and receiver
      dispatch(
        newMessage({
          conversation_id: conversation_id,
          sender_name: sender_name,
          content: message_content,
          timestamp: timestamp,
          sender_avatar: sender_avatar,
        })
      );

      // Handle the incoming message, for example, by updating the UI
      console.log(`New message from ${sender_name}: ${message_content}`);
    });

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
      messagingSocket.disconnect();
      console.log("Client side disconnected from sockets.");
    };
  }, [
    addSnackbar,
    dispatch,
    linkupManagementSocket,
    linkupRequestSocket,
    messagingSocket,
    userId,
  ]);

  const sockets = {
    linkupManagementSocket,
    linkupRequestSocket,
    messagingSocket,
  };

  return (
    <SocketContext.Provider value={sockets}>{children}</SocketContext.Provider>
  );
};

export const useSockets = () => {
  return useContext(SocketContext);
};
