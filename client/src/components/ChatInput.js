import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  chatInput: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    background: "#f9f9f9",
    boxSizing: "border-box",
    padding: theme.spacing(1),
  },
  textField: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  sendButton: {
    minWidth: "unset", // Remove the minimum width set by default
  },
}));

const ChatInput = () => {
  const classes = useStyles();

  const handleSendMessage = () => {
    // Handle send message logic here
    console.log("Sending message...");
  };

  return (
    <div className={classes.chatInput}>
      <TextField
        className={classes.textField}
        variant="outlined"
        placeholder="Start a new message..."
      />
      {/* <IconButton
        className={classes.sendButton}
        color="primary"
        onClick={handleSendMessage}
      >
        <SendIcon />
      </IconButton> */}
    </div>
  );
};

export default ChatInput;
