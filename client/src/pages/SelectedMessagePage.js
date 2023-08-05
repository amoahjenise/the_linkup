import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import LeftMenu from "../components/LeftMenu";
import MessagesSection from "../components/MessagesSection";
import ChatComponent from "../components/ChatComponent";

const useStyles = makeStyles((theme) => ({
  selectedMessagePage: {
    display: "flex",
    height: "100vh",
  },
  messageSection: {
    flex: 1,
    overflowY: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
  chatContainer: {
    flex: 1,
  },
}));

const SelectedMessagePage = ({ selectedMessage }) => {
  const classes = useStyles();
  const { messageId } = useParams();

  const mockData = [
    {
      avatar: "https://via.placeholder.com/50",
      title: "Latifa",
      subtitle: "Hey! Which movie are you trying to watch?",
      date: new Date(),
      unread: 0,
      id: "1",
    },
    {
      avatar: "https://via.placeholder.com/50",
      title: "John",
      subtitle: "Can you join the meeting at 2 PM?",
      date: new Date(),
      unread: 3,
      id: "2",
    },
    // Add more mock messages here
  ];

  return (
    <div>
      <div className={classes.selectedMessagePage}>
        <LeftMenu />
        <div className={classes.messageSection}>
          <MessagesSection />
        </div>

        <div className={classes.chatContainer}>
          <ChatComponent />
        </div>
      </div>
    </div>
  );
};

export default SelectedMessagePage;
