import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useSendbirdStateContext } from "@sendbird/uikit-react";
import SBConversation from "@sendbird/uikit-react/GroupChannel";
import SBChannelList from "@sendbird/uikit-react/GroupChannelList";
import sendbirdSelectors from "@sendbird/uikit-react/sendbirdSelectors";
import ChannelListHeader from "./ChannelListHeader";
import CustomChannelHeader from "./CustomChannelHeader";
import { getChannelFirstTwoMessages } from "../api/sendbirdAPI";
import { getLinkupByConversation } from "../api/messagingAPI";
import { useMediaQuery } from "@mui/material";
import "./CustomSendbirdMain.css";

const BOTTOM_MENU_HEIGHT = 60; // Your bottom menu height

const SendbirdChat = () => {
  // State management
  const [currentChannel, setCurrentChannel] = useState(null);
  const [isMessageInputDisabled, setMessageInputDisabled] = useState(true);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [linkup, setLinkup] = useState(null);
  const [isOperator, setIsOperator] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  // Hooks and context
  const globalStore = useSendbirdStateContext();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;

  // Handle window resize for mobile viewport
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

  // Business logic
  const checkMessageInputState = useCallback(
    (linkupResponse, response) => {
      return (
        linkupResponse.linkup.request_status === "declined" ||
        (!isOperator &&
          response.messages.length === 1 &&
          linkupResponse.linkup.request_status !== "accepted") ||
        linkupResponse.linkup.requester_status === "inactive"
      );
    },
    [isOperator]
  );

  // Fetch channel data
  useEffect(() => {
    const fetchChannelData = async () => {
      if (!currentChannel?._url) return;

      try {
        const [linkupResponse, channel, response] = await Promise.all([
          getLinkupByConversation(currentChannel._url),
          getGroupChannel()(currentChannel._url),
          getChannelFirstTwoMessages(
            currentChannel._url,
            currentChannel.createdAt
          ),
        ]);

        setLinkup(linkupResponse.linkup);
        const operator = channel?.members.find(
          (member) => member.role === "operator"
        );
        setIsOperator(operator?.userId === userId);
        setMessageInputDisabled(
          checkMessageInputState(linkupResponse, response)
        );
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    };

    fetchChannelData();
  }, [currentChannel?._url, userId, getGroupChannel, checkMessageInputState]);

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
          // renderChannelHeader={() => (
          //   <CustomChannelHeader
          //     linkup={linkup}
          //     channel={currentChannel}
          //     isOperator={isOperator}
          //     isMobile={true}
          //     setCurrentChannel={setCurrentChannel}
          //   />
          // )}
          onBackClick={() => setCurrentChannel(null)}
          replyType={isMobile ? "QUOTE_REPLY" : "THREAD"}
          showSearchIcon={!isMobile}
          isReactionEnabled={!isMobile}
        />
      ),
    [currentChannel, isMessageInputDisabled, linkup, isOperator]
  );

  return (
    <div
      style={{
        height: `${windowHeight}px`,
        width: "100%",
        overflow: "hidden",
      }}
    >
      {!currentChannel ? renderChannelList : renderConversation}
    </div>
  );
};

export default SendbirdChat;
