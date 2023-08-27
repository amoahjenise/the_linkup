import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Messages from "./Messages";
import TopNavBar from "./TopNavBar";

const useStyles = makeStyles((theme) => ({
  messagesSection: {
    // Styles for the messages section container
  },
  messageItem: {
    // Styles for each message item in the list
    cursor: "pointer",
    padding: theme.spacing(2),
    // Add additional styling as needed
  },
  selectedMessageItem: {
    // Styles for the selected message item
    backgroundColor: theme.palette.primary.light,
    // Add additional styling as needed
  },
}));

const MessagesSection = ({ messages, selectedMessage, onMessageClick }) => {
  const classes = useStyles();

  return (
    <div>
      <TopNavBar title="Messages" />
      {messages ? (
        <Messages
          messages={messages}
          selectedMessage={selectedMessage}
          onMessageClick={onMessageClick}
        />
      ) : (
        <Typography variant="body1">Loading messages...</Typography>
      )}
    </div>
  );
};

export default MessagesSection;
