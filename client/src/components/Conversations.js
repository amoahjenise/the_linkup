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
import { useColorMode } from "@chakra-ui/react";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(7), // Adjust the width as needed
    height: theme.spacing(7), // Adjust the height as needed
    marginRight: theme.spacing(2),
  },
  loadingSpinner: {
    padding: theme.spacing(10),
  },
  listItem: {
    borderBottom: "1px solid #e1e8ed",
    cursor: "pointer",
    transition: "background-color 0.3s ease-in-out",
    "&.selected": {
      backgroundColor: "rgba(200, 210, 230, 0.4)",
    },
    "&:hover": {
      backgroundColor: "rgba(200, 210, 230, 0.5)",
    },
  },
  highlightedListItem: {
    backgroundColor: "rgba(200, 200, 200, 0.1)",
  },
  textLightMode: {
    color: "black",
  },
  textDarkMode: {
    color: "white",
  },
  messageText: {
    color: "white",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  badge: {
    marginRight: theme.spacing(1),
  },
  // Add a style for the blue dot indicator
  unreadDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "blue",
    borderRadius: "50%",
    marginRight: theme.spacing(1), // Adjust the margin as needed
    marginLeft: theme.spacing(2),
  },
}));

const Conversations = ({ isLoading, error }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { colorMode } = useColorMode(); // Get the color mode

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
            const isCurrentUserSender =
              conversation?.last_message_sender_id === userId;

            const isHighlighted = conversation.unread_count > 0;

            return (
              <ListItem
                key={conversation?.conversation_id}
                className={`${classes.listItem} ${
                  selectedConversation &&
                  selectedConversation?.conversation_id ===
                    conversation?.conversation_id
                    ? "selected"
                    : ""
                } ${isHighlighted ? classes.highlightedListItem : ""}`}
                onClick={() => dispatch(setSelectedConversation(conversation))}
              >
                <ListItemAvatar>
                  <Avatar
                    className={classes.avatar}
                    alt={
                      userId === conversation.linkup_creator_id
                        ? conversation.linkup_requester_name
                        : conversation.linkup_creator_name
                    }
                    src={
                      userId === conversation.linkup_creator_id
                        ? conversation.linkup_requester_avatar
                        : conversation.linkup_creator_avatar
                    }
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <div
                      className={
                        colorMode === "dark"
                          ? classes.textDarkMode // Set to white for dark mode
                          : classes.textLightMode // Default (black) for light mode
                      }
                    >
                      {userId === conversation.linkup_creator_id
                        ? conversation.linkup_requester_name
                        : conversation.linkup_creator_name}
                    </div>
                  }
                  secondary={
                    <span
                      className={
                        colorMode === "dark"
                          ? classes.messageText // Set to white for dark mode
                          : ""
                      }
                    >
                      {isCurrentUserSender ? "You: " : ""}
                      {conversation?.last_message}
                    </span>
                  }
                />
                {isCurrentUserSender
                  ? `Sent ${formatTimestamp(
                      conversation?.last_message_timestamp
                    )}`
                  : `Received ${formatTimestamp(
                      conversation?.last_message_timestamp
                    )}`}
                {/* Add the blue dot indicator when there are unread messages */}
                {isHighlighted && <div className={classes.unreadDot}></div>}
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
};

export default Conversations;
