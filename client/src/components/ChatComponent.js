import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  chatSection: {
    border: "1px solid #ddd",
    height: "100vh",
    width: "75%",
  },
  messageArea: {
    flex: "1",
    overflow: "auto",
    padding: theme.spacing(2),
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
  sendButton: {
    marginTop: theme.spacing(1),
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
    <div>
      <Grid container className={classes.chatSection}>
        <Grid item xs={12}>
          <List className={classes.messageArea}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                className={
                  message.sender === "John" ? classes.listItemRight : undefined
                }
              >
                <Grid
                  container
                  alignItems="flex-start"
                  justifyContent={
                    message.sender === "John" ? "flex-end" : "flex-start"
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
                  <Grid item>
                    <ListItemText
                      align={message.sender === "John" ? "right" : "left"}
                      primary={message.content}
                    />
                    <ListItemText
                      align={message.sender === "John" ? "right" : "left"}
                      secondary={message.timestamp}
                    />
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Grid container style={{ padding: "30px" }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
              />
            </Grid>
            <Grid xs={1} align="right">
              <Fab
                color="primary"
                aria-label="add"
                className={classes.sendButton}
              >
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ChatComponent;
