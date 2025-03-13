import React, { useRef, useEffect } from "react";
import {
  GroupChannelProvider,
  useGroupChannel,
} from "@sendbird/uikit-react/GroupChannel/context";
import { GroupChannelHeader } from "@sendbird/uikit-react/GroupChannel/components/GroupChannelHeader";
import { MessageList } from "@sendbird/uikit-react/GroupChannel/components/MessageList";
import MessageInput from "@sendbird/uikit-react/ui/MessageInput";
import "./CustomConversation.css"; // Custom CSS file for styling

const CustomConversation = ({ channelUrl, isMessageInputDisabled }) => {
  const bottomRef = useRef(null);

  const handleScrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="tinder-chat-container">
      <GroupChannelProvider channelUrl={channelUrl}>
        <CustomConversationUI
          isMessageInputDisabled={isMessageInputDisabled}
          bottomRef={bottomRef}
          handleScrollToBottom={handleScrollToBottom}
        />
      </GroupChannelProvider>
    </div>
  );
};

const CustomConversationUI = ({
  isMessageInputDisabled,
  bottomRef,
  handleScrollToBottom,
}) => {
  const { allMessages } = useGroupChannel(); // Access context data here!

  useEffect(() => {
    if (allMessages) {
      handleScrollToBottom();
    }
  }, [allMessages]);

  return (
    <div className="chat-wrapper">
      <GroupChannelHeader className="chat-header" />
      <div className="message-list-wrapper">
        {/* Display messages with a fallback when there are no messages */}
        {allMessages && allMessages.length > 0 ? (
          <MessageList />
        ) : (
          <p className="no-messages">Start the conversation!</p>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="message-input-wrapper">
        <MessageInput disabled={isMessageInputDisabled} />
      </div>
    </div>
  );
};

export default CustomConversation;
