import React, { createContext, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { useSnackbar } from "./SnackbarContext";
import { useDispatch } from "react-redux";
import { incrementUnreadMessagesCount } from "../redux/actions/messageActions";
import { incrementUnreadNotificationsCount } from "../redux/actions/notificationActions";
import {
  updateConversation,
  newMessage,
} from "../redux/actions/conversationActions";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const conversations = useSelector(
    (state) => state.conversation.conversations
  );
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser.user.id;

  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

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
    // Function to authenticate the user with the sockets
    const authenticateUser = (socket) => {
      socket.emit("authenticate", userId);
    };

    // Authenticate users with their respective sockets
    // authenticateUser(linkupManagementSocket);
    // authenticateUser(linkupRequestSocket);
    authenticateUser(messagingSocket);

    // Messaging Service Events

    messagingSocket.on("new-message", (data) => {
      // Data contains the incoming message details, e.g., sender_id, message_content, conversation_id
      const {
        timestamp,
        message_id,
        message_content,
        sender_id,
        sender_name,
        sender_avatar,
        conversation_id,
      } = data;

      // Dispatch the newMessage action to update the Redux store for both sender and receiver
      dispatch(
        newMessage({
          message_id: message_id,
          conversation_id: conversation_id,
          sender_id: sender_id,
          sender_name: sender_name,
          sender_avatar: sender_avatar,
          content: message_content,
          timestamp: timestamp,
        })
      );

      // Find the conversation with the matching conversation_id in the conversations array
      if (conversations) {
        const conversationToUpdate = conversations.find(
          (conversation) => conversation.conversation_id === conversation_id
        );

        // Check if the conversation was found
        if (conversationToUpdate) {
          // Create an updated conversation object with the new last_message and last_message_timestamp
          const updatedConversation = {
            ...conversationToUpdate,
            last_message: message_content,
            last_message_timestamp: timestamp,
          };

          // Dispatch the updateConversation action to update the conversation in the Redux store
          dispatch(updateConversation(updatedConversation));
        }
      }

      // Increment the unread messages count if the user is not in the current conversation
      if (selectedConversation?.conversation_id !== conversation_id) {
        dispatch(incrementUnreadMessagesCount());
      }
    });

    messagingSocket.on("new-message-notification", (notification) => {
      addSnackbar(notification.content, { timeout: 7000 });
      dispatch(incrementUnreadNotificationsCount());
      // dispatch(incrementConversationUnreadCount());
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
      // messagingSocket.disconnect();
      console.log("Client side disconnected from sockets.");
    };
  }, [
    addSnackbar,
    conversations,
    linkupManagementSocket,
    linkupRequestSocket,
    messagingSocket,
    userId,
    dispatch,
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
