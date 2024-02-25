import React, { useEffect, useRef, useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Avatar from "@material-ui/core/Avatar";
import {
  markMessagesAsReadBatch,
  getConversationMessages,
} from "../api/messagingAPI";

import { markMessagesAsRead } from "../redux/actions/messageActions";

import { useSelector, useDispatch } from "react-redux";
import {
  updateConversation,
  setMessages,
} from "../redux/actions/conversationActions";
import ChatInput from "./ChatInput";
import HorizontalMenu from "./HorizontalMenu";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(1.5),
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
  bubbleContainer: {
    display: "flex",
    flexDirection: "row",
    cursor: "default",
  },
  bubble: {
    borderRadius: "12px", // Increase the border radius for a cleaner look
    padding: theme.spacing(2),
    width: "fit-content", // Adjust the width for a cleaner appearance
    margin: "5px",
  },
  senderBubble: {
    backgroundColor: "#0084ff",
    color: "#fff",
    marginLeft: "auto",
    borderTopRightRadius: "0px",
    borderBottomRightRadius: "12px", // Add a radius to the bottom right for a cleaner edge
  },
  recipientBubble: {
    backgroundColor: "#707070",
    color: "#fff",
    marginRight: "auto",
    borderTopLeftRadius: "0px",
    borderBottomLeftRadius: "12px", // Add a radius to the bottom left for a cleaner edge
  },

  avatar: {
    marginRight: theme.spacing(1),
    alignSelf: "flex-end",
  },
}));

const ScrollableList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );
  const messages = useSelector((state) => state.conversation.messages); // Integrate messages

  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;
  const listRef = useRef(null);
  const [showElapsedTime, setShowElapsedTime] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

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

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation?.conversation_id) {
        const conversationId = selectedConversation?.conversation_id;

        if (conversationId && userId) {
          try {
            const response = await getConversationMessages(
              conversationId,
              userId
            );

            const sortedMessages = response.data.messages.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );

            // Dispatch an action to update the Redux store with the real messages
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
      }
    };

    fetchMessages();

    // Additional code for scrolling and checking messages in the view
  }, [dispatch, selectedConversation, userId]);

  // // Function to mark a message as read
  // const markMessageAsRead = (messageIds) => {
  //   console.log("receiverId", receiverId);
  //   // dispatch(markMessagesAsRead(messageIds, receiverId));
  //   console.log("Marking message as read:", messageIds);
  // };

  // const handleScroll = () => {
  //   const listContainer = listRef.current;
  //   const containerTop = listContainer.getBoundingClientRect().top;
  //   const containerBottom = listContainer.getBoundingClientRect().bottom;

  //   const messageIdsToMarkAsRead = [];

  //   messages.forEach((message) => {
  //     const messageElement = document.querySelector(
  //       `[data-message-id="${message.message_id}"]`
  //     );
  //     if (messageElement) {
  //       const messageTop = messageElement.getBoundingClientRect().top;
  //       const messageBottom = messageElement.getBoundingClientRect().bottom;

  //       if (messageTop >= containerTop && messageBottom <= containerBottom) {
  //         messageIdsToMarkAsRead.push(message.message_id);
  //       }
  //     }
  //   });
  //
  //   // Mark messages as read in batch
  //   markMessageAsRead(messageIdsToMarkAsRead);
  // };

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

  const scrollToBottom = () => {
    if (listRef.current && messages.length > 0) {
      const lastMessage = listRef.current.lastElementChild;
      lastMessage.scrollIntoView({ behavior: "auto" });
    }
  };

  const handleBubbleClick = () => {
    setShowElapsedTime(true);

    setTimeout(() => {
      setShowElapsedTime(false);
    }, 3000);
  };

  return (
    <>
      {selectedConversation?.conversation_id ? (
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
          <div
            ref={listRef}
            // onScroll={handleScroll}
            onClick={handleBubbleClick}
            style={{
              overflowY: "auto",
              height: "80%",
              width: "500px",
              padding: "20px",
            }}
          >
            {messages?.map((message, index) => {
              const isLastMessage =
                index === messages.length - 1 &&
                selectedConversation?.last_message_id === message.message_id;

              const isNextMessageDifferentSender =
                index < messages.length - 1 &&
                message.sender_id !== messages[index + 1]?.sender_id;

              const isCurrentUserMessage = message.sender_id === userId;
              return (
                <div
                  key={message.message_id}
                  data-message-id={message.message_id}
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
                        <input
                          type="checkbox"
                          checked={message.is_read}
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInput
            senderId={senderId}
            receiverId={receiverId}
            userId={userId}
            conversationId={selectedConversation?.conversation_id}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ScrollableList;

// import React, { useEffect, useRef, useState, useMemo } from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import List from "@material-ui/core/List";
// import Avatar from "@material-ui/core/Avatar";
// import {
//   markMessagesAsReadBatch,
//   getConversationMessages,
// } from "../api/messagingAPI";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   updateConversation,
//   setMessages,
// } from "../redux/actions/conversationActions";
// import ChatInput from "./ChatInput";
// import HorizontalMenu from "./HorizontalMenu";

// const useStyles = makeStyles((theme) => ({
//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: theme.spacing(1.5),
//     borderBottom: "1px solid #e1e8ed",
//   },
//   headerLeft: {
//     display: "flex",
//     alignItems: "center",
//   },
//   headerRight: {
//     display: "flex",
//     alignItems: "center",
//   },
//   headerAvatar: {
//     width: "40px",
//     height: "40px",
//     marginRight: theme.spacing(2),
//   },
//   headerName: {
//     fontWeight: "bold",
//   },
//   bubbleContainer: {
//     display: "flex",
//     flexDirection: "row",
//     cursor: "default",
//   },
//   bubble: {
//     borderRadius: "12px", // Increase the border radius for a cleaner look
//     padding: theme.spacing(2),
//     width: "fit-content", // Adjust the width for a cleaner appearance
//     margin: "5px",
//   },
//   senderBubble: {
//     backgroundColor: "#0084ff",
//     color: "#fff",
//     marginLeft: "auto",
//     borderTopRightRadius: "0px",
//     borderBottomRightRadius: "12px", // Add a radius to the bottom right for a cleaner edge
//   },
//   recipientBubble: {
//     backgroundColor: "#707070",
//     color: "#fff",
//     marginRight: "auto",
//     borderTopLeftRadius: "0px",
//     borderBottomLeftRadius: "12px", // Add a radius to the bottom left for a cleaner edge
//   },

//   avatar: {
//     marginRight: theme.spacing(1),
//     alignSelf: "flex-end",
//   },
// }));

// const ScrollableList = () => {
//   const classes = useStyles();
//   const dispatch = useDispatch();
//   const selectedConversation = useSelector(
//     (state) => state.conversation.selectedConversation
//   );
//   const [messages, setLocalMessages] = useState([]);
//   const loggedUser = useSelector((state) => state.loggedUser);
//   const userId = loggedUser?.user?.id;
//   const [visibleMessages, setVisibleMessages] = useState([]);
//   const listRef = useRef(null);
//   const [showElapsedTime, setShowElapsedTime] = useState(false);
//   const [menuAnchor, setMenuAnchor] = useState(null);

//   const senderId = useMemo(() => {
//     return userId;
//   }, [userId]);

//   const receiverId = useMemo(() => {
//     return selectedConversation?.participant_id_1 === userId
//       ? selectedConversation?.participant_id_2
//       : selectedConversation?.participant_id_1;
//   }, [selectedConversation, userId]);

//   const receiverAvatar = useMemo(() => {
//     return selectedConversation?.participant_id_1 === userId
//       ? selectedConversation?.participant_avatar_2
//       : selectedConversation?.participant_avatar_1;
//   }, [selectedConversation, userId]);

//   const receiverName = useMemo(() => {
//     return selectedConversation?.participant_id_1 === userId
//       ? selectedConversation?.participant_name_2
//       : selectedConversation?.participant_name_1;
//   }, [selectedConversation, userId]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (selectedConversation?.conversation_id) {
//         const conversationId = selectedConversation?.conversation_id;

//         if (conversationId && userId) {
//           try {
//             // Fetch real messages using the getConversationMessages function
//             const response = await getConversationMessages(
//               conversationId,
//               userId
//             );

//             const sortedMessages = response.data.messages.sort(
//               (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
//             );

//             // Dispatch an action to update the Redux store with the real messages
//             setLocalMessages(sortedMessages);
//             // if (sortedMessages)
//             //   dispatch(
//             //     setMessages(
//             //       response.data.participants,
//             //       sortedMessages,
//             //       response.data.linkup_id,
//             //       conversationId
//             //     )
//             //   );
//           } catch (error) {
//             console.error("Error fetching messages:", error);
//           }
//         }
//       }
//     };

//     fetchMessages();

//     // Additional code for scrolling and checking messages in the view
//   }, [dispatch, selectedConversation, userId]);

//   // Function to mark a message as read
//   const markMessageAsRead = (messageId) => {
//     setLocalMessages((prevMessages) =>
//       prevMessages.map((message) =>
//         message.message_id === messageId
//           ? { ...message, is_read: true }
//           : message
//       )
//     );
//   };

//   const handleScroll = () => {
//     // Get the visible area in the message list container
//     const listContainer = listRef.current;
//     const containerTop = listContainer.getBoundingClientRect().top;
//     const containerBottom = listContainer.getBoundingClientRect().bottom;

//     // Iterate through messages and check if they are in view
//     messages.forEach((message) => {
//       const messageElement = document.querySelector(
//         `[data-message-id="${message.message_id}"]`
//       );
//       if (messageElement) {
//         const messageTop = messageElement.getBoundingClientRect().top;
//         const messageBottom = messageElement.getBoundingClientRect().bottom;

//         if (messageTop >= containerTop && messageBottom <= containerBottom) {
//           // Message is in view, mark it as read
//           markMessageAsRead(message.message_id);
//           // Add the message to the visibleMessages array
//           if (!visibleMessages.includes(message.message_id)) {
//             setVisibleMessages((prevVisibleMessages) => [
//               ...prevVisibleMessages,
//               message.message_id,
//             ]);
//           }
//         }
//       }
//     });
//   };

//   const getElapsedTime = (timestamp) => {
//     const currentTime = new Date();
//     const sentTime = new Date(timestamp);
//     const elapsedMilliseconds = currentTime - sentTime;

//     if (elapsedMilliseconds < 1000) {
//       return "Just now";
//     } else if (elapsedMilliseconds < 60 * 1000) {
//       const seconds = Math.floor(elapsedMilliseconds / 1000);
//       return `${seconds}s ago`;
//     } else if (elapsedMilliseconds < 60 * 60 * 1000) {
//       const minutes = Math.floor(elapsedMilliseconds / (60 * 1000));
//       return `${minutes}m ago`;
//     } else if (elapsedMilliseconds < 24 * 60 * 60 * 1000) {
//       const hours = Math.floor(elapsedMilliseconds / (60 * 60 * 1000));
//       return `${hours}h ago`;
//     } else {
//       const days = Math.floor(elapsedMilliseconds / (24 * 60 * 60 * 1000));
//       return `${days}d ago`;
//     }
//   };

//   const scrollToBottom = () => {
//     if (listRef.current && messages.length > 0) {
//       const lastMessage = listRef.current.lastElementChild;
//       lastMessage.scrollIntoView({ behavior: "auto" });
//     }
//   };

//   const handleBubbleClick = () => {
//     setShowElapsedTime(true);

//     setTimeout(() => {
//       setShowElapsedTime(false);
//     }, 3000);
//   };
//   return (
//     <>
//       {selectedConversation?.conversation_id ? (
//         <>
//           <div className={classes.header}>
//             <div className={classes.headerLeft}>
//               <Avatar
//                 alt={receiverName}
//                 src={receiverAvatar}
//                 className={classes.headerAvatar}
//               />
//               <div className={classes.headerName}>{receiverName}</div>
//             </div>
//             <div className={classes.headerRight}>
//               {selectedConversation?.linkup_creator_id === userId ? (
//                 <HorizontalMenu
//                   showGoToItem={false}
//                   showEditItem={false}
//                   showDeleteItem={false}
//                   showCloseItem={false}
//                   showCheckInLinkup={true}
//                   showAcceptLinkupRequest={true}
//                   menuAnchor={menuAnchor}
//                   setMenuAnchor={setMenuAnchor}
//                 />
//               ) : (
//                 <div />
//               )}
//             </div>
//           </div>
//           <div
//             ref={listRef}
//             onScroll={handleScroll}
//             onClick={handleBubbleClick}
//             style={{
//               overflowY: "auto",
//               height: "80%",
//               width: "500px",
//               padding: "20px",
//             }}
//           >
//             {messages?.map((message, index) => {
//               const isLastMessage =
//                 index === messages.length - 1 &&
//                 selectedConversation?.last_message_id === message.message_id;

//               const isNextMessageDifferentSender =
//                 index < messages.length - 1 &&
//                 message.sender_id !== messages[index + 1]?.sender_id;

//               const isCurrentUserMessage = message.sender_id === userId;
//               return (
//                 <div
//                   key={message.message_id}
//                   data-message-id={message.message_id}
//                 >
//                   <div className={classes.bubbleContainer}>
//                     {!isCurrentUserMessage &&
//                     (isNextMessageDifferentSender || isLastMessage) ? (
//                       <Avatar
//                         alt={message?.sender_name}
//                         src={message?.sender_avatar}
//                         className={classes.avatar}
//                       />
//                     ) : (
//                       <div className={classes.noAvatarMargin}></div>
//                     )}
//                     <div
//                       className={
//                         isCurrentUserMessage
//                           ? `${classes.bubble} ${classes.senderBubble}`
//                           : `${classes.bubble} ${classes.recipientBubble}`
//                       }
//                     >
//                       {message?.content}
//                     </div>
//                     {showElapsedTime && (
//                       <div className={classes.elapsedTime}>
//                         {getElapsedTime(message?.timestamp)}
//                         <input
//                           type="checkbox"
//                           checked={message.is_read}
//                           readOnly
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           <ChatInput
//             senderId={senderId}
//             receiverId={receiverId}
//             userId={userId}
//             conversationId={selectedConversation?.conversation_id}
//           />
//         </>
//       ) : (
//         <></>
//       )}
//     </>
//   );
// };

// export default ScrollableList;
