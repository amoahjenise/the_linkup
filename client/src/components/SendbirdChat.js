import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import SBConversation from "@sendbird/uikit-react/GroupChannel";
import SBChannelList from "@sendbird/uikit-react/GroupChannelList";
import SBChannelSettings from "@sendbird/uikit-react/ChannelSettings";
import sendbirdSelectors from "@sendbird/uikit-react/sendbirdSelectors";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";
import ChannelListHeader from "./ChannelListHeader";
import CustomChannelHeader from "./CustomChannelHeader";
import { getChannelFirstTwoMessages } from "../api/sendbirdAPI";
import { getLinkupByConversation } from "../api/messagingAPI";

// Styled components
const Container = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
  width: "100%",
}));

const ChannelListWrap = styled("div")(({ theme }) => ({
  borderRight: "1px solid lightgrey",
  height: "100%",
  overflowY: "auto",
}));

const ConversationWrap = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
}));

const MobileContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
}));

const FullWidthChannelList = styled(SBChannelList)(({ theme }) => ({
  width: "100%", // Full width for mobile
}));

const SendbirdChat = () => {
  const [currentChannel, setCurrentChannel] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isMessageInputDisabled, setMessageInputDisabled] = useState(true);

  const globalStore = useSendbirdStateContext();

  // Move the selector call to a separate function
  const getGroupChannel = useCallback(() => {
    return sendbirdSelectors.getGetGroupChannel(globalStore);
  }, [globalStore]);

  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;

  const [linkup, setLinkup] = useState(null);
  const [isOperator, setIsOperator] = useState(false);

  const handleChannelSelect = useCallback((channel) => {
    setCurrentChannel(channel);
  }, []);

  useEffect(() => {
    const fetchChannelData = async () => {
      if (!currentChannel?._url) return;

      try {
        const linkupResponse = await getLinkupByConversation(
          currentChannel._url
        );
        setLinkup(linkupResponse.linkup);

        const channel = await getGroupChannel()(currentChannel._url); // Call the selector function
        const operator = channel?.members.find(
          (member) => member.role === "operator"
        );
        setIsOperator(operator && operator.userId === userId);

        const response = await getChannelFirstTwoMessages(
          currentChannel._url,
          channel.createdAt
        );
        setMessageInputDisabled(
          linkupResponse.linkup.request_status === "declined" ||
            (!isOperator &&
              response.messages.length === 1 &&
              linkupResponse.linkup.request_status !== "accepted") ||
            linkupResponse.linkup.requester_status === "inactive"
        );
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    };

    fetchChannelData();
  }, [currentChannel, getGroupChannel, userId, isOperator]);

  const renderConversation = () => (
    <>
      <SBConversation
        channelUrl={currentChannel._url}
        onChatHeaderActionClick={() => setShowSettings(true)}
        disabled={isMessageInputDisabled}
        renderChannelHeader={() => (
          <CustomChannelHeader
            linkup={linkup}
            channel={currentChannel}
            onActionClick={() => setShowSettings(true)}
            isOperator={isOperator}
            isMobile={isMobile}
            setCurrentChannel={setCurrentChannel}
          />
        )}
      />
      {showSettings && (
        <SBChannelSettings
          channelUrl={currentChannel?._url}
          onCloseClick={() => setShowSettings(false)}
        />
      )}
    </>
  );

  return (
    <Container>
      {!isMobile ? (
        <>
          <ChannelListWrap>
            <SBChannelList
              allowProfileEdit={false}
              isMessageReceiptStatusEnabled
              isTypingIndicatorEnabled
              selectedChannelUrl={currentChannel?._url}
              onChannelCreated={setCurrentChannel}
              onChannelSelect={handleChannelSelect}
              renderHeader={() => <ChannelListHeader />}
            />
          </ChannelListWrap>
          <ConversationWrap>
            {currentChannel && <>{renderConversation()}</>}
          </ConversationWrap>
        </>
      ) : (
        <MobileContainer>
          {!currentChannel ? (
            <FullWidthChannelList
              allowProfileEdit={false}
              isMessageReceiptStatusEnabled
              isTypingIndicatorEnabled
              selectedChannelUrl={currentChannel?._url}
              disableAutoSelect
              onChannelCreated={setCurrentChannel}
              onChannelSelect={handleChannelSelect}
              renderHeader={() => <ChannelListHeader />}
            />
          ) : (
            <ConversationWrap>{renderConversation()}</ConversationWrap>
          )}
        </MobileContainer>
      )}
    </Container>
  );
};

export default SendbirdChat;
