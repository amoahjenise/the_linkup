import React, { useEffect, useRef, useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Avatar from "@material-ui/core/Avatar";
import {
  markConversationMessagesAsRead,
  getConversationMessages,
} from "../api/messagingAPI";
import { useSelector, useDispatch } from "react-redux";
import { getUnreadMessagesCount } from "../api/messagingAPI";
import {
  updateConversation,
  setMessages,
} from "../redux/actions/conversationActions";
import { setUnreadMessagesCount } from "../redux/actions/messageActions";
import ChatInput from "./ChatInput";
import HorizontalMenu from "./HorizontalMenu";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    borderBottom: "1px solid #e1e8ed",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
  },
  headerAvatar: {
    width: "40px",
    height: "40px",
    marginRight: theme.spacing(2),
  },
  headerName: {
    fontWeight: "bold",
  },
  menu: {
    marginLeft: "auto", // Push the menu to the right
  },
  chatSection: {
    overflow: "auto",
    padding: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "stretch",
  },
  bubbleContainer: {
    display: "flex",
    flexDirection: "row",
    cursor: "default",
  },
  bubble: {
    borderRadius: "10px",
    padding: "10px",
    width: "65%",
    margin: "5px",
  },
  senderBubble: {
    backgroundColor: "#0084ff",
    color: "#fff",
    marginLeft: "auto",
    borderTopRightRadius: "0px",
  },
  recipientBubble: {
    backgroundColor: "#707070",
    color: "#fff",
    borderTopLeftRadius: "0px",
    marginRight: "auto",
  },
  avatar: {
    marginRight: "8px",
    alignSelf: "flex-end",
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    width: "500px",
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
  const [showElapsedTime, setShowElapsedTime] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  // const [messagesToMarkAsRead, setMessagesToMarkAsRead] = useState([]);
  const chatListRef = useRef(null);

  const senderId = useMemo(() => {
    return userId;
  }, [userId]);

  const receiverId = useMemo(() => {
    return selectedConversation?.participant_id_1 === userId
      ? selectedConversation?.participant_id_2
      : selectedConversation?.participant_id_1;
  }, [selectedConversation, userId]);

  const receiverAvatar = useMemo(() => {
    return selectedConversation?.participant_id_1 === userId
      ? selectedConversation?.participant_avatar_2
      : selectedConversation?.participant_avatar_1;
  }, [selectedConversation, userId]);

  const receiverName = useMemo(() => {
    return selectedConversation?.participant_id_1 === userId
      ? selectedConversation?.participant_name_2
      : selectedConversation?.participant_name_1;
  }, [selectedConversation, userId]);

  const scrollToBottom = () => {
    if (chatListRef.current && messages.length > 0) {
      const lastMessage = chatListRef.current.lastElementChild;
      lastMessage.scrollIntoView({ behavior: "auto" });
    }
  };

  // const markMessageAsRead = (messageId) => {
  //   setMessagesToMarkAsRead((prevMessages) => [...prevMessages, messageId]);
  // };

  // const markMessagesAsReadOnScroll = () => {
  //   if (chatListRef.current && messages) {
  //     const options = {
  //       root: chatListRef.current,
  //       rootMargin: "0px",
  //       threshold: 0.1,
  //     };

  //     const callback = (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           const messageId = entry.target.dataset.messageid; // Ensure consistent data attribute name
  //           console.log("Marking message as read:", messageId);
  //           markMessageAsRead(messageId);
  //         }
  //       });
  //     };

  //     const observer = new IntersectionObserver(callback, options);

  //     messages.forEach((message) => {
  //       const messageElement = document.getElementById(
  //         `message-${message.message_id}`
  //       );
  //       if (messageElement) {
  //         console.log("Observing message:", message.message_id);
  //         observer.observe(messageElement);
  //       }
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (messagesToMarkAsRead.length > 0) {
  //     markMessagesAsReadBatch(messagesToMarkAsRead, receiverId)
  //       .then((response) => {
  //         const { unread_count } = response;

  //         if (selectedConversation) {
  //           const updatedConversation = {
  //             ...selectedConversation,
  //             unread_count: unread_count,
  //           };

  //           dispatch(updateConversation(updatedConversation));
  //         }

  //         setMessagesToMarkAsRead([]);
  //       })
  //       .catch((error) => {
  //         console.error("Error marking messages as read:", error);
  //       });
  //   }
  // }, [messagesToMarkAsRead, selectedConversation]);

  // useEffect(() => {
  //   markMessagesAsReadOnScroll();
  // }, [selectedConversation]);

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
    }, 3000);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation?.conversation_id) {
        const conversationId = selectedConversation?.conversation_id;

        if (selectedConversation.unread_count > 0) {
          try {
            await markConversationMessagesAsRead(
              selectedConversation.conversation_id,
              receiverId
            );

            const updatedConversation = {
              ...selectedConversation,
              unread_count: 0,
            };

            dispatch(updateConversation(updatedConversation));

            // Fetch unread conversations count and update Redux state
            getUnreadMessagesCount(loggedUser.user.id)
              .then((data) => {
                dispatch(setUnreadMessagesCount(Number(data.unread_count)));
              })
              .catch((error) => {
                console.error("Error fetching unread messages count:", error);
              });
          } catch (error) {
            console.error("Error marking messages as read:", error);
          }
        }

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
          <div className={classes.header}>
            <div className={classes.headerLeft}>
              <Avatar
                alt={receiverName}
                src={receiverAvatar}
                className={classes.headerAvatar}
              />
              <div className={classes.headerName}>{receiverName}</div>
            </div>
            <div className={classes.headerRight}>
              {selectedConversation?.linkup_creator_id === userId ? (
                <HorizontalMenu
                  showGoToItem={false}
                  showEditItem={false}
                  showDeleteItem={false}
                  showCloseItem={false}
                  showCheckInLinkup={true}
                  showAcceptLinkupRequest={true}
                  menuAnchor={menuAnchor}
                  setMenuAnchor={setMenuAnchor}
                />
              ) : (
                <div />
              )}
            </div>
          </div>
          <List className={classes.chatSection} ref={chatListRef}>
            {messages?.map((message, index) => {
              const isLastMessage =
                index === messages.length - 1 &&
                selectedConversation?.last_message_id === message.message_id;

              const isNextMessageDifferentSender =
                index < messages.length - 1 &&
                message.sender_id !== messages[index + 1]?.sender_id;

              const isCurrentUserMessage = message.sender_id === userId;

              const messageElementId = `message-${message.message_id}`;

              return (
                <div
                  id={messageElementId}
                  key={message?.message_id}
                  onClick={handleBubbleClick}
                  data-messageid={message?.message_id}
                >
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
