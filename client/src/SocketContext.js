// SocketContext.js (client-side)
import React, { createContext, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { useSnackbar } from "./contexts/SnackbarContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { addSnackbar } = useSnackbar();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser.user.id;
  const socket = io("http://localhost:3003", {
    query: { userId },
  });

  useEffect(() => {
    console.log(`Client side user ${userId} connected to socket io.`);

    socket.on("linkupCreated", () => {
      console.log("Socket io client: linkupCreated executed.");
    });

    // Modify this part to listen for "sendExpiredLinkups" event
    socket.on("linkupExpired", (expiredLinkup) => {
      // Display a toast for each expired linkup
      addSnackbar(`Linkup ${expiredLinkup.linkupId} has expired!`);
    });

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
      console.log("Client side disconnected from socket io.");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
