import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import ConversationsSection from "../components/ConversationsSection";
import ChatComponent from "../components/ChatComponent";
import { getConversations } from "../api/messagingAPI";
import {
  setSelectedConversation,
  setConversations,
} from "../redux/actions/conversationActions";
import ScrollableList from "../components/ScrollableList";

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
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        dispatch(setConversations(uniqueConversations));
      } catch (error) {
        console.error("Error fetching conversations:", error);
        // setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    // Cleanup function: Set selectedConversation to null on unmount
    return () => {
      dispatch(setSelectedConversation(null));
      dispatch(setConversations(null));
    };
  }, [dispatch, userId]);

  return (
    <div className={classes.conversationsPage}>
      {isMobile ? (
        <div className={classes.conversationsSection}>
          <ConversationsSection />
        </div>
      ) : (
        <div className={classes.conversationsPage}>
          <div className={classes.conversationsSection}>
            <ConversationsSection isLoading={isLoading} error={error} />
          </div>
          <div className={classes.chatSection}>
            <ChatComponent />
            {/* <ScrollableList /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;
