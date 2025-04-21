import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useSendbirdStateContext } from "@sendbird/uikit-react";
import SBConversation from "@sendbird/uikit-react/GroupChannel";
import SBChannelList from "@sendbird/uikit-react/GroupChannelList";
import { useGroupChannel } from "@sendbird/uikit-react/GroupChannel/context";
import { MessageList } from "@sendbird/uikit-react/GroupChannel/components/MessageList";
import sendbirdSelectors from "@sendbird/uikit-react/sendbirdSelectors";
import ChannelListHeader from "./ChannelListHeader";
import CustomChannelHeader from "./CustomChannelHeader";
import { getChannelFirstTwoMessages } from "../api/sendbirdAPI";
import { getLinkupByConversation } from "../api/messagingAPI";
import { useMediaQuery } from "@mui/material";
import "../styles/CustomSendbirdMain.css";

const BOTTOM_MENU_HEIGHT = 60;

// Create a separate component for the message list with auto-scroll
const MessageListWithAutoScroll = (props) => {
  const { state, actions } = useGroupChannel();
  const messages = state.messages;
  const { scrollToBottom } = actions;

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length, scrollToBottom]);

  return <MessageList {...props} />;
};

const SendbirdChat = () => {
  // State management
  const [currentChannel, setCurrentChannel] = useState(null);
  const [isMessageInputDisabled, setMessageInputDisabled] = useState(true);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [linkup, setLinkup] = useState(null);
  const [isOperator, setIsOperator] = useState(false);

  // Hooks and context
  const globalStore = useSendbirdStateContext();
  const isMobile = useMediaQuery("(max-width:600px)");
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Channel functions
  const getGroupChannel = useCallback(() => {
    return sendbirdSelectors.getGetGroupChannel(globalStore);
  }, [globalStore]);

  const handleChannelSelect = useCallback((channel) => {
    setCurrentChannel(channel);
  }, []);

  // Fetch channel data

  useEffect(() => {
    const fetchChannelData = async () => {
      if (!currentChannel?._url) return;

      try {
        const [linkupResponse, channel, response] = await Promise.all([
          getLinkupByConversation(currentChannel._url),
          getGroupChannel(currentChannel._url),
          getChannelFirstTwoMessages(
            currentChannel._url,
            currentChannel.createdAt
          ),
        ]);

        setLinkup(linkupResponse.linkup);

        const operator = channel?.members.find(
          (member) => member.role === "operator"
        );
        const isUserOperator = operator?.userId === userId;
        setIsOperator(isUserOperator);

        const shouldDisable =
          linkupResponse.linkup.request_status === "declined" ||
          (!isUserOperator &&
            response.messages.length === 1 &&
            linkupResponse.linkup.request_status !== "accepted") ||
          linkupResponse.linkup.requester_status === "inactive";
        setMessageInputDisabled(shouldDisable);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    };

    fetchChannelData();
  }, [currentChannel?._url, userId]);

  // Component rendering
  const renderChannelList = useMemo(
    () => (
      <SBChannelList
        allowProfileEdit={false}
        isMessageReceiptStatusEnabled
        isTypingIndicatorEnabled
        selectedChannelUrl={currentChannel?._url}
        disableAutoSelect
        onChannelCreated={setCurrentChannel}
        onChannelSelect={handleChannelSelect}
        renderHeader={() => <ChannelListHeader />}
      />
    ),
    [currentChannel?._url, handleChannelSelect]
  );

  const renderConversation = useMemo(
    () =>
      currentChannel && (
        <SBConversation
          channelUrl={currentChannel._url}
          disabled={isMessageInputDisabled}
          renderChannelHeader={() => (
            <CustomChannelHeader
              linkup={linkup}
              channel={currentChannel}
              isOperator={isOperator}
              isMobile={isMobile}
              setCurrentChannel={setCurrentChannel}
            />
          )}
          onBackClick={() => setCurrentChannel(null)}
          // replyType={isMobile ? "QUOTE_REPLY" : "THREAD"}
          // showSearchIcon={!isMobile}
          isReactionEnabled={!isMobile}
          renderMessageList={(props) => (
            <MessageListWithAutoScroll {...props} />
          )}
        />
      ),
    [currentChannel, isMessageInputDisabled, linkup, isOperator, isMobile]
  );

  // Container styles
  const containerStyle = {
    // height: isMobile
    //   ? `calc(${windowHeight}px - ${BOTTOM_MENU_HEIGHT}px)`
    //   : "100vh",
    height: "100%",

    width: "100%",
    display: isMobile ? "block" : "flex",
    position: "relative",
    overflow: "hidden",
  };

  const channelListStyle = {
    width: isMobile ? "100%" : "320px",
    minWidth: isMobile ? "auto" : "320px",
    height: "100%",
  };

  const conversationStyle = {
    flex: 1,
    height: "100%",
    width: "100%",
  };

  return (
    <div style={containerStyle}>
      {isMobile ? (
        // Mobile: Single panel view
        !currentChannel ? (
          renderChannelList
        ) : (
          renderConversation
        )
      ) : (
        // Desktop: Side-by-side view
        <>
          <div style={channelListStyle}>{renderChannelList}</div>
          <div style={conversationStyle}>{renderConversation}</div>
        </>
      )}
    </div>
  );
};

export default SendbirdChat;
