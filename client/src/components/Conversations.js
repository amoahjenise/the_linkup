import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { setSelectedConversation } from "../redux/actions/conversationActions";
import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  listItem: {
    borderBottom: "1px solid #e1e8ed",
    cursor: "pointer",
    "&.selected": {
      backgroundColor: "rgba(200, 200, 200, 0.1)",
    },
  },
  messageText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const Conversations = ({ conversations }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

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

  const getElapsedTime = (timestamp, isReceiver) => {
    const formattedTimestamp = formatTimestamp(timestamp);

    if (isReceiver) {
      return `Received ${formattedTimestamp}`;
    } else {
      return `Sent ${formattedTimestamp}`;
    }
  };

  return (
    <List>
      {conversations.map((conversation) => {
        // Determine which participant is the other user (not the connected user)
        const otherParticipant =
          conversation?.participant_id_1 === userId
            ? {
                id: conversation?.participant_id_2,
                name: conversation?.participant_name_2,
                avatar: conversation?.participant_avatar_2,
              }
            : {
                id: conversation?.participant_id_1,
                name: conversation?.participant_name_1,
                avatar: conversation?.participant_avatar_1,
              };

        // Determine if the conversation is on the receiver's side
        const isReceiver = conversation?.participant_id_2 === userId;

        return (
          <ListItem
            key={conversation?.conversation_id}
            className={`${classes.listItem} ${
              setSelectedConversation &&
              selectedConversation?.id === conversation?.conversation_id
                ? "selected"
                : ""
            }`}
            onClick={() => dispatch(setSelectedConversation(conversation))}
          >
            <ListItemAvatar>
              <Avatar
                alt={otherParticipant.name}
                src={otherParticipant.avatar}
              />
            </ListItemAvatar>
            <ListItemText
              primary={otherParticipant.name}
              secondary={
                <>
                  <div className={classes.messageText}>
                    <span>{conversation?.last_message}</span>
                  </div>
                </>
              }
            />
            {getElapsedTime(conversation?.created_at, isReceiver)}
          </ListItem>
        );
      })}
    </List>
  );
};

export default Conversations;
