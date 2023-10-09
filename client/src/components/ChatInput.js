import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import { useSockets } from "../contexts/SocketContext";
import { useColorMode } from "@chakra-ui/react";

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
  // Define custom styles for the input and label
  input: {
    color: "white", // Change the text color
  },
  label: {
    color: "lightblue", // Change the label color
  },
}));

const ChatInput = ({ senderId, receiverId, conversationId }) => {
  const classes = useStyles();
  const { colorMode } = useColorMode(); // Get the color mode

  const { messagingSocket } = useSockets();

  const [messageContent, setMessageContent] = useState("");

  const handleSendMessage = () => {
    if (
      messagingSocket &&
      senderId &&
      receiverId &&
      conversationId &&
      messageContent.length > 0
    ) {
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Prevent the default behavior of the "Enter" key (e.g., line break in the text field)
      event.preventDefault();
      // Call the handleSendMessage function to send the message
      handleSendMessage();
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
        onKeyPress={handleKeyPress}
        InputProps={{
          // Conditionally apply custom input styles based on the colorMode
          className: colorMode === "dark" ? classes.input : "",
        }}
        InputLabelProps={{
          // Apply custom label styles
          className: colorMode === "dark" ? classes.label : "",
        }}
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
