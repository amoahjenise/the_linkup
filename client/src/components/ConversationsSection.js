import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Conversations from "./Conversations";
import TopNavBar from "./TopNavBar";

const useStyles = makeStyles((theme) => ({
  loadingText: {
    padding: theme.spacing(2),
  },
}));

const MessagesSection = ({
  conversations,
  selectedMessage,
  onConversationClick,
}) => {
  const classes = useStyles();

  return (
    <div>
      <TopNavBar title="Messages" />
      {conversations ? (
        <Conversations
          conversations={conversations}
          selectedMessage={selectedMessage}
          onConversationClick={onConversationClick}
        />
      ) : (
        <Typography variant="body1" className={classes.loadingText}>
          Loading conversations...
        </Typography>
      )}
    </div>
  );
};

export default MessagesSection;
