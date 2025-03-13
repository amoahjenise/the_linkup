import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import SBConversation from "@sendbird/uikit-react/GroupChannel";
import SBChannelList from "@sendbird/uikit-react/GroupChannelList";
import SBChannelSettings from "@sendbird/uikit-react/ChannelSettings";
import sendbirdSelectors from "@sendbird/uikit-react/sendbirdSelectors";
import { useSendbirdStateContext } from "@sendbird/uikit-react";
import ChannelListHeader from "./ChannelListHeader";
import CustomChannelHeader from "./CustomChannelHeader";
import { getChannelFirstTwoMessages } from "../api/sendbirdAPI";
import { getLinkupByConversation } from "../api/messagingAPI";
import "./CustomSendbirdMain.css";
// Actions
import { setIsInConversation } from "../redux/actions/conversationActions";

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
  height: "100%", // Adjust height to account for footer
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

  // Add dispatch hook
  const dispatch = useDispatch();

  // Move the selector call to a separate function
  const getGroupChannel = useCallback(() => {
    return sendbirdSelectors.getGetGroupChannel(globalStore);
  }, [globalStore]);

  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;

  const [linkup, setLinkup] = useState(null);
  const [isOperator, setIsOperator] = useState(false);
  const scrollRef = useRef(null); // Reference for auto-scrolling

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

  const conversationWrapRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (conversationWrapRef.current) {
        conversationWrapRef.current.scrollTop =
          conversationWrapRef.current.scrollHeight;
      }
    };

    // Add event listener for window resizing (this also accounts for keyboard resizing)
    window.addEventListener("resize", handleResize);

    // Initial scroll to bottom on mount
    if (conversationWrapRef.current) {
      conversationWrapRef.current.scrollTop =
        conversationWrapRef.current.scrollHeight;
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchChannelData = async () => {
      if (!currentChannel?._url) {
        dispatch(setIsInConversation(false));
        return;
      }

      dispatch(setIsInConversation(true));

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
          checkMessageInputState(linkupResponse, response)
        );
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    };

    fetchChannelData();

    return () => {
      if (!currentChannel?._url) {
        dispatch(setIsInConversation(false));
      }
    };
  }, [currentChannel, getGroupChannel, userId, isOperator, dispatch]);

  const renderChannelList = useMemo(() => {
    return (
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
    );
  }, [currentChannel]);

  const renderConversation = useMemo(() => {
    return currentChannel ? (
      <div className="sendbird-app__conversation-wrap">
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
              setIsInConversation={setIsInConversation}
            />
          )}
        />
        {showSettings && (
          <SBChannelSettings
            channelUrl={currentChannel?._url}
            onCloseClick={() => setShowSettings(false)}
          />
        )}
      </div>
    ) : null;
  }, [
    currentChannel,
    isMessageInputDisabled,
    linkup,
    showSettings,
    isMobile,
    isOperator,
  ]);

  const renderDesktop = () => (
    <div className="customized-app">
      <div className="sendbird-app__wrap">
        <div className="sendbird-app__channellist-wrap">
          <SBChannelList
            allowProfileEdit={false}
            isMessageReceiptStatusEnabled
            isTypingIndicatorEnabled
            selectedChannelUrl={currentChannel?._url}
            onChannelCreated={setCurrentChannel}
            onChannelSelect={handleChannelSelect}
            renderHeader={() => <ChannelListHeader />}
          />
        </div>

        <div
          ref={conversationWrapRef}
          className="sendbird-app__conversation-wrap"
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            maxHeight: isMobile ? "calc(100vh - 60px)" : "100vh", // Apply maxHeight only on mobile
          }}
        >
          {renderConversation}
        </div>
      </div>
    </div>
  );

  const renderMobile = () => (
    <MobileContainer>
      {!currentChannel ? renderChannelList : renderConversation}
    </MobileContainer>
  );

  return <Container>{!isMobile ? renderDesktop() : renderMobile()}</Container>;
};

export default SendbirdChat;
