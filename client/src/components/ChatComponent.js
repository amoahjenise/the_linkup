import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Avatar from "@material-ui/core/Avatar";
import { getConversationMessages } from "../api/messagingAPI";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/actions/conversationActions";
import ChatInput from "./ChatInput";

const useStyles = makeStyles((theme) => ({
  chatSection: {
    overflow: "auto",
    padding: theme.spacing(6),
    height: "80%",
    borderBottom: "1px solid #e1e8ed",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "stretch", // Adjusted alignment
  },
  noAvatarMargin: {
    margin: "25px",
  },
  bubbleContainer: {
    display: "flex",
    flexDirection: "row",
    cursor: "default",
  },
  bubble: {
    borderRadius: "10px", // Increased border radius
    padding: "10px", // Increased padding
    width: "70%",
    margin: "5px",
  },
  senderBubble: {
    backgroundColor: "#0084ff", // Changed sender bubble color
    color: "#fff",
    marginLeft: "auto",
    borderTopRightRadius: "0px", // Adjusted border radius
  },
  recipientBubble: {
    backgroundColor: "#707070", // Changed recipient bubble color
    color: "#fff", // Changed text color
    borderTopLeftRadius: "0px", // Adjusted border radius
    marginRight: "auto",
  },
  avatar: {
    marginRight: "8px",
    alignSelf: "flex-end", // Adjusted avatar alignment
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
    borderTop: "1px solid #e1e8ed", // Added border
    background: "#fff", // Changed background color
  },
  textField: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  sendButton: {
    flexShrink: 0,
  },
  elapsedTime: {
    marginLeft: theme.spacing(2),
    fontSize: "12px",
    opacity: 1,
    transition: "opacity 0.3s ease-in-out",
    alignSelf: "center", // Adjusted alignment
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

  const chatListRef = useRef(null);

  const [showElapsedTime, setShowElapsedTime] = useState(false);
  const elapsedTimeDisplayDuration = 3000;

  const scrollToBottom = () => {
    if (chatListRef.current && messages.length > 0) {
      const lastMessage = chatListRef.current.lastElementChild;
      lastMessage.scrollIntoView({ behavior: "auto" });
    }
  };

  const getElapsedTime = (timestamp) => {
    const currentTime = new Date();
    const sentTime = new Date(timestamp);
    const elapsedMilliseconds = currentTime - sentTime;

    if (elapsedMilliseconds < 1000) {
      return "Just now";
    } else if (elapsedMilliseconds < 60 * 1000) {
      const seconds = Math.floor(elapsedMilliseconds / 1000);
      return `${seconds}s ago`;
    } else if (elapsedMilliseconds < 60 * 60 * 1000) {
      const minutes = Math.floor(elapsedMilliseconds / (60 * 1000));
      return `${minutes}m ago`;
    } else if (elapsedMilliseconds < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(elapsedMilliseconds / (60 * 60 * 1000));
      return `${hours}h ago`;
    } else {
      const days = Math.floor(elapsedMilliseconds / (24 * 60 * 60 * 1000));
      return `${days}d ago`;
    }
  };

  const handleBubbleClick = () => {
    setShowElapsedTime(true);

    setTimeout(() => {
      setShowElapsedTime(false);
    }, elapsedTimeDisplayDuration);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    scrollToBottom();

    return () => {
      dispatch(setMessages([], [], null, null));
    };
  }, [dispatch, selectedConversation, userId]);

  return (
    <div className={classes.chatContainer}>
      {selectedConversation?.conversation_id && (
        <>
          <List className={classes.chatSection} ref={chatListRef}>
            {messages?.map((message, index) => {
              const isLastMessage =
                index === messages.length - 1 &&
                selectedConversation?.last_message_id === message.message_id;

              const isNextMessageDifferentSender =
                index < messages.length - 1 &&
                message.sender_id !== messages[index + 1]?.sender_id;

              const isCurrentUserMessage = message.sender_id === userId;

              return (
                <div key={message?.message_id} onClick={handleBubbleClick}>
                  <div className={classes.bubbleContainer}>
                    {!isCurrentUserMessage &&
                    (isNextMessageDifferentSender || isLastMessage) ? (
                      <Avatar
                        alt={message?.sender_name}
                        src={message?.sender_avatar}
                        className={classes.avatar}
                      />
                    ) : (
                      <div className={classes.noAvatarMargin}></div>
                    )}
                    <div
                      className={
                        isCurrentUserMessage
                          ? `${classes.bubble} ${classes.senderBubble}`
                          : `${classes.bubble} ${classes.recipientBubble}`
                      }
                    >
                      {message?.content}
                    </div>
                    {showElapsedTime && (
                      <div className={classes.elapsedTime}>
                        {getElapsedTime(message?.timestamp)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </List>
          <ChatInput
            senderId={senderId}
            receiverId={receiverId}
            userId={userId}
            conversationId={selectedConversation?.conversation_id}
          />
        </>
      )}
    </div>
  );
};

export default ChatComponent;
