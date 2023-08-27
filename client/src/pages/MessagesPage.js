import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MessagesSection from "../components/MessagesSection";
import ChatComponent from "../components/ChatComponent";

const useStyles = makeStyles((theme) => ({
  messagesPage: {
    display: "flex",
    width: "75%",
    [theme.breakpoints.down("sm")]: {
      width: "100%", // Set to 100% in mobile mode
    },
  },
  messageSection: {
    flex: 1,
    borderRight: "1px solid #e1e8ed",
  },
  chatSection: {
    borderRight: "1px solid #e1e8ed",
    overflowY: "auto",
  },
}));

const MessagesPage = () => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Simulating API call to fetch user's messages
  useEffect(() => {
    // Mock data to simulate API response
    const mockMessages = [
      {
        id: "1",
        sender: "John",
        subject: "Hello",
        timestamp: "2023-06-28T21:00:00Z",
        content: "This is the content of the first message.",
      },
      {
        id: "2",
        sender: "Louise",
        subject: "Meeting Reminder",
        timestamp: "2023-05-21T11:00:00Z",
        content: "This is the content of the second message.",
      },
      // Add more mock messages here
    ];
    setMessages(mockMessages);
  }, []);

  const handleOpenChat = (message) => {
    setSelectedMessage(message);
  };

  return (
    <div className={classes.messagesPage}>
      <div className={classes.messageSection}>
        <MessagesSection
          messages={messages}
          selectedMessage={selectedMessage}
          onMessageClick={handleOpenChat}
        />
      </div>
      <div className={classes.chatSection}>
        <ChatComponent selectedMessage={selectedMessage} />
      </div>
    </div>
  );
};

export default MessagesPage;
