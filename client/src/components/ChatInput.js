import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import { useSockets } from "../contexts/SocketContext";

const useStyles = makeStyles((theme) => ({
  chatInput: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  textField: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  sendButton: {
    minWidth: "unset",
  },
}));

const ChatInput = ({ senderId, receiverId, conversationId }) => {
  const classes = useStyles();
  const { messagingSocket } = useSockets();

  const [messageContent, setMessageContent] = useState("");

  const handleSendMessage = () => {
    if (messagingSocket && senderId && receiverId && conversationId) {
      // Emit a "send-message" event to the server with user input
      messagingSocket.emit("send-message", {
        sender_id: senderId,
        receiver_id: receiverId,
        message_content: messageContent,
        conversation_id: conversationId,
      });

      // Clear the input field after sending the message
      setMessageContent("");
    }
  };

  return (
    <div className={classes.chatInput}>
      <TextField
        id="outlined-basic-email"
        label="Type Something"
        className={classes.textField}
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
      />
      <Fab
        color="primary"
        aria-label="send"
        className={classes.sendButton}
        onClick={handleSendMessage}
      >
        <SendIcon />
      </Fab>
    </div>
  );
};

export default ChatInput;
