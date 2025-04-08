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
import "./CustomSendbirdMain.css";

const MOBILE_BREAKPOINT = 600;
const BOTTOM_MENU_HEIGHT = 60;

const SendbirdChat = () => {
  const [currentChannel, setCurrentChannel] = useState(null);
  const [isMessageInputDisabled, setMessageInputDisabled] = useState(true);
  const globalStore = useSendbirdStateContext();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;
  const [linkup, setLinkup] = useState(null);
  const [isOperator, setIsOperator] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Track window dimensions
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // Initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowDimensions.width <= MOBILE_BREAKPOINT;

  // Calculate dynamic height for mobile
  const mobileHeight = `calc(${windowDimensions.height}px - ${BOTTOM_MENU_HEIGHT}px)`;

  const getGroupChannel = useCallback(() => {
    return sendbirdSelectors.getGetGroupChannel(globalStore);
  }, [globalStore]);

  const handleChannelSelect = useCallback((channel) => {
    setCurrentChannel(channel);
  }, []);

  const checkMessageInputState = (linkupResponse, response) => {
    return (
      linkupResponse.linkup.request_status === "declined" ||
      (!isOperator &&
        response.messages.length === 1 &&
        linkupResponse.linkup.request_status !== "accepted") ||
      linkupResponse.linkup.requester_status === "inactive"
    );
  };

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
  }, [currentChannel?._url, userId, getGroupChannel]);

  useEffect(() => {
    if (!isMobile) return;

    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

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
          onBackClick={() => setCurrentChannel(null)} // Mobile back button handler
          // Mobile-specific optimizations
          replyType={isMobile ? "QUOTE_REPLY" : "THREAD"}
          showSearchIcon={!isMobile}
          isReactionEnabled={!isMobile}
        />
      ),
    [currentChannel, isMessageInputDisabled, linkup, isOperator]
  );

  return (
    <div>
      {isMobile ? (
        // Mobile layout - single panel at a time
        <div
          style={{
            height: mobileHeight,
            width: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {!currentChannel ? renderChannelList : renderConversation}
        </div>
      ) : (
        // Desktop layout - side by side
        <div
          style={{
            display: "flex",
            height: "100vh",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "320px",
              minWidth: "320px",
              borderRight: "1px solid #e6e6e6",
            }}
          >
            {renderChannelList}
          </div>
          <div style={{ flex: 1 }}>{renderConversation}</div>
        </div>
      )}
    </div>
  );
};

export default SendbirdChat;
