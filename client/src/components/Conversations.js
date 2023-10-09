import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@material-ui/core";
import { setSelectedConversation } from "../redux/actions/conversationActions";
import { useSelector, useDispatch } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";

const useStyles = makeStyles((theme) => ({
  loadingSpinner: {
    padding: theme.spacing(10),
  },
  listItem: {
    borderBottom: "1px solid #e1e8ed",
    cursor: "pointer",
    "&.selected": {
      backgroundColor: "rgba(200, 200, 200, 0.1)",
    },
    "&:hover": {
      backgroundColor: "rgba(200, 200, 200, 0.2)",
    },
  },
  messageText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const Conversations = ({ isLoading, error }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const conversations = useSelector(
    (state) => state.conversation.conversations
  );

  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;

  const formatTimestamp = (timestamp) => {
    const currentTime = new Date();
    const sentTime = new Date(timestamp);
    const elapsedMilliseconds = currentTime - sentTime;

    if (elapsedMilliseconds < 1000) {
      return "Just now";
    } else if (elapsedMilliseconds < 60 * 1000) {
      const seconds = Math.floor(elapsedMilliseconds / 1000);
      return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
    } else if (elapsedMilliseconds < 60 * 60 * 1000) {
      const minutes = Math.floor(elapsedMilliseconds / (60 * 1000));
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (elapsedMilliseconds < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(elapsedMilliseconds / (60 * 60 * 1000));
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(elapsedMilliseconds / (24 * 60 * 60 * 1000));
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  return (
    <>
      {isLoading ? (
        <div className={classes.loadingSpinner}>
          <LoadingSpinner />
        </div>
      ) : (
        <List>
          {conversations?.map((conversation) => {
            // Determine if the logged-in user is the sender of the last message
            const isCurrentUserSender =
              conversation?.last_message_sender_id === userId;

            return (
              <ListItem
                key={conversation?.conversation_id}
                className={`${classes.listItem} ${
                  setSelectedConversation &&
                  selectedConversation?.conversation_id ===
                    conversation?.conversation_id
                    ? "selected"
                    : ""
                }`}
                onClick={() => dispatch(setSelectedConversation(conversation))}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={conversation.linkup_requester_name}
                    src={conversation.linkup_requester_avatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={conversation.linkup_requester_name}
                  secondary={
                    <div className={classes.messageText}>
                      <span>
                        {isCurrentUserSender ? "You: " : ""}
                        {conversation?.last_message}
                      </span>
                    </div>
                  }
                />
                {isCurrentUserSender
                  ? `Sent ${formatTimestamp(
                      conversation?.last_message_timestamp
                    )}`
                  : `Received ${formatTimestamp(
                      conversation?.last_message_timestamp
                    )}`}
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
};

export default Conversations;
