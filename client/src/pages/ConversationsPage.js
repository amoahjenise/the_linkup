import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import ConversationsSection from "../components/ConversationsSection";
import ChatComponent from "../components/ChatComponent";
import { getConversations } from "../api/messagingAPI";

const useStyles = makeStyles((theme) => ({
  conversationsPage: {
    display: "flex",
    width: "100%",
  },
  conversationsSection: {
    flex: "1",
    overflowY: "auto",
    overflowX: "hidden",
    marginLeft: "auto",
    marginRight: "auto",
    borderRight: "1px solid #e1e8ed",
  },
  chatSection: {
    borderRight: "1px solid #e1e8ed",
    overflowY: "auto",
  },
}));

const ConversationsPage = ({ isMobile }) => {
  const classes = useStyles();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await getConversations(userId);
        // Remove duplicate conversations based on conversation_id
        const uniqueConversations = response.data.reduce(
          (acc, conversation) => {
            if (
              !acc.some(
                (c) => c.conversation_id === conversation.conversation_id
              )
            ) {
              acc.push(conversation);
            }
            return acc;
          },
          []
        );
        setConversations(uniqueConversations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setError("Error fetching conversations");
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userId]);

  const handleOpenChat = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className={classes.conversationsPage}>
      {loading ? (
        <div>Loading conversations...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          {isMobile ? (
            <div className={classes.conversationsSection}>
              <ConversationsSection
                conversations={conversations}
                selectedConversation={selectedConversation}
                onConversationClick={handleOpenChat}
                userId={userId} // Pass the userId to determine the other participant's name and avatar
              />
            </div>
          ) : (
            <div className={classes.conversationsPage}>
              <div className={classes.conversationsSection}>
                <ConversationsSection
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  onConversationClick={handleOpenChat}
                  userId={userId} // Pass the userId to determine the other participant's name and avatar
                />
              </div>
              <div className={classes.chatSection}>
                <ChatComponent selectedConversation={selectedConversation} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConversationsPage;
