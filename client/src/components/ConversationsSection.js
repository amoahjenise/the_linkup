import React from "react";
import Conversations from "./Conversations";
import TopNavBar from "./TopNavBar";
import { useSelector } from "react-redux";

const MessagesSection = ({ isLoading, error }) => {
  const conversations = useSelector(
    (state) => state.conversation.conversations
  );

  return (
    <div>
      <TopNavBar title="Messages" />
      <Conversations
        conversations={conversations}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default MessagesSection;
