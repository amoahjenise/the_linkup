import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LeftMenu from "../components/LeftMenu";
import MessagesSection from "../components/MessagesSection";
import ChatComponent from "../components/ChatComponent";

const useStyles = makeStyles((theme) => ({
  messagesPage: {
    display: "flex",
    height: "100vh",
  },
  messageSection: {
    flex: 1,
    overflowY: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
  chatSection: {
    flex: 1,
  },
}));

const MessagesPage = () => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Simulating API call to fetch user's messages
  useEffect(() => {
    // API call to fetch messages associated with the active user
    // Example API call: fetchUserMessages(userId)
    // Replace `fetchUserMessages` with your actual API call
    // const fetchUserMessages = async (userId) => {
    //   const response = await fetch(`/api/users/${userId}/messages`);
    //   const data = await response.json();
    //   setMessages(data.messages);
    // };

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

    // ...

    // Set the messages in state
    setMessages(mockMessages);
  }, []);

  const handleOpenChat = (message) => {
    setSelectedMessage(message);
  };

  return (
    <div className={classes.messagesPage}>
      <LeftMenu />
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
