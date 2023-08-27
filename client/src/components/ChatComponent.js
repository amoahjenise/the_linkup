import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  chatSection: {
    overflow: "auto",
    padding: theme.spacing(4),
    height: "80%",
    borderBottom: "1px solid #e1e8ed",
  },
  listItemRight: {
    justifyContent: "flex-end",
  },
  avatarLeft: {
    marginRight: theme.spacing(1),
  },
  avatarRight: {
    marginLeft: theme.spacing(1),
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Added to position at the bottom
    height: "100%",
  },
  sendContainer: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  textField: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  sendButton: {
    flexShrink: 0,
  },
}));

const ChatComponent = ({ selectedMessage }) => {
  const classes = useStyles();

  // Simulated conversation data
  const messages = [
    {
      id: "1",
      sender: "John",
      content: "Hey Jane, What's up?",
      timestamp: "09:30",
      avatar: "https://material-ui.com/static/images/avatar/2.jpg",
    },
    {
      id: "2",
      sender: "Jane",
      content: "Hey, I am Good! What about you?",
      timestamp: "09:31",
      avatar: "https://material-ui.com/static/images/avatar/3.jpg",
    },
    {
      id: "3",
      sender: "John",
      content: "Cool. I am good, let's catch up!",
      timestamp: "10:30",
      avatar: "https://material-ui.com/static/images/avatar/2.jpg",
    },
  ];

  return (
    <div className={classes.chatContainer}>
      <List className={classes.chatSection}>
        {messages.map((message) => (
          <ListItem
            key={message.id}
            className={
              message.sender === "John" ? classes.listItemRight : undefined
            }
          >
            <Avatar
              alt={message.sender}
              src={message.avatar}
              className={
                message.sender === "John"
                  ? classes.avatarRight
                  : classes.avatarLeft
              }
            />
            <ListItemText
              align={message.sender === "John" ? "right" : "left"}
              primary={message.content}
              secondary={message.timestamp}
            />
          </ListItem>
        ))}
      </List>
      <div className={classes.sendContainer}>
        <TextField
          id="outlined-basic-email"
          label="Type Something"
          className={classes.textField}
        />
        <Fab color="primary" aria-label="send" className={classes.sendButton}>
          <SendIcon />
        </Fab>
      </div>
    </div>
  );
};

export default ChatComponent;
