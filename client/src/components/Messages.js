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

const useStyles = makeStyles((theme) => ({
  listItem: {
    cursor: "pointer",
    "&.selected": {
      backgroundColor: theme.palette.grey[200],
    },
  },
}));

const Messages = ({ messages, selectedMessage, onMessageClick }) => {
  const classes = useStyles();

  const getElapsedTime = (timestamp) => {
    const currentTime = new Date();
    const sentTime = new Date(timestamp);
    const elapsedMinutes = Math.floor((currentTime - sentTime) / (1000 * 60));

    if (elapsedMinutes < 1) {
      return "Just now";
    } else if (elapsedMinutes < 60) {
      return `Sent ${elapsedMinutes} mins ago`;
    } else if (elapsedMinutes < 1440) {
      const elapsedHours = Math.floor(elapsedMinutes / 60);
      return `Sent ${elapsedHours} hours ago`;
    } else {
      const elapsedDays = Math.floor(elapsedMinutes / 1440);
      return `Sent ${elapsedDays} days ago`;
    }
  };

  return (
    <List>
      {messages.map((message) => (
        <ListItem
          key={message.id}
          className={`${classes.listItem} ${
            selectedMessage && selectedMessage.id === message.id
              ? "selected"
              : ""
          }`}
          onClick={() => onMessageClick(message)}
        >
          <ListItemAvatar>
            <Avatar
              alt={message.sender}
              src={
                message.sender === "John"
                  ? "https://material-ui.com/static/images/avatar/2.jpg"
                  : "https://material-ui.com/static/images/avatar/4.jpg"
              }
            />
          </ListItemAvatar>
          <ListItemText
            primary={message.sender}
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  {message.content}
                </Typography>{" "}
                {getElapsedTime(message.timestamp)}
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default Messages;
