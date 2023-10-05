import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import { getConversationMessages } from "../api/messagingAPI";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/actions/conversationActions";
import ChatInput from "./ChatInput";

const useStyles = makeStyles((theme) => ({
  chatSection: {
    overflow: "auto",
    padding: theme.spacing(4),
    height: "80%",
    borderBottom: "1px solid #e1e8ed",
  },
  listItemRight: {
    justifyContent: "flex-end",
    textAlign: "right", // Align text to the right for sender messages
  },
  avatarLeft: {
    marginRight: theme.spacing(1),
  },
  avatarRight: {
    marginLeft: theme.spacing(2),
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    width: "500px",
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

const ChatComponent = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );
  const messages = useSelector((state) => state.conversation.messages);
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;

  const senderId = userId;
  const receiverId =
    selectedConversation?.participant_id_1 === userId
      ? selectedConversation?.participant_id_2
      : selectedConversation?.participant_id_1;

  const senderAvatar =
    userId === selectedConversation?.participant_id_1
      ? selectedConversation?.participant_avatar_1
      : selectedConversation?.participant_avatar_2;

  const receiverAvatar =
    userId === selectedConversation?.participant_id_1
      ? selectedConversation?.participant_avatar_2
      : selectedConversation?.participant_avatar_1;

  // Define a function to calculate elapsed time in minutes
  const getElapsedTime = (timestamp) => {
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

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation?.conversation_id) {
        const conversationId = selectedConversation?.conversation_id;

        if (conversationId && userId)
          try {
            const response = await getConversationMessages(
              conversationId,
              userId
            );

            // Convert timestamp strings to Date objects and sort by ascending order
            const sortedMessages = response.data.messages.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );

            dispatch(
              setMessages(
                response.data.participants,
                sortedMessages,
                response.data.linkup_id,
                conversationId
              )
            );
          } catch (error) {
            console.error("Error fetching messages:", error);
          }
      }
    };

    fetchMessages();

    return () => {
      dispatch(setMessages([], [], null, null));
    };
  }, [dispatch, selectedConversation, userId]);

  return (
    <div className={classes.chatContainer}>
      <List className={classes.chatSection}>
        {messages.map((message) => (
          <ListItem
            key={message?.message_id}
            className={
              message?.sender_id === senderId
                ? `${classes.listItemRight} sender-message`
                : "receiver-message"
            }
          >
            {message?.sender_id === senderId ? (
              <>
                <Avatar
                  alt={loggedUser?.user?.name} // Use sender's name
                  src={message?.sender_avatar} // Use sender's avatar URL
                  className={classes.avatarRight}
                />
                <ListItemText
                  primary={message?.content}
                  secondary={getElapsedTime(message?.timestamp, false)}
                  align="right"
                />
              </>
            ) : (
              <>
                <Avatar
                  alt={message?.sender_name} // Use sender's name
                  src={message?.sender_avatar} // Use sender's avatar URL
                  className={classes.avatarLeft}
                />
                <ListItemText
                  primary={message?.content}
                  secondary={getElapsedTime(message?.timestamp, true)}
                />
              </>
            )}
          </ListItem>
        ))}
      </List>
      {selectedConversation?.conversation_id && (
        <ChatInput
          senderId={senderId}
          receiverId={receiverId}
          userId={userId}
          conversationId={selectedConversation?.conversation_id}
        />
      )}
    </div>
  );
};

export default ChatComponent;
