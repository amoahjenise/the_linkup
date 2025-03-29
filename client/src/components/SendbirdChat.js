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

const MobileContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "calc(100vh - 60px)", // Deduct 60px for bottom menu
  position: "relative",
  overflow: "hidden",
}));

const ConversationWrapper = styled("div")({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  paddingBottom: "env(safe-area-inset-bottom)", // Handle device notches
});

const KeyboardSpacer = styled("div")({
  height: "0px",
  transition: "height 0.3s ease",
  "@media (max-width: 600px)": {
    ".keyboard-visible &": {
      height: "250px", // Adjust based on your keyboard height
    },
  },
});

const FullWidthChannelList = styled(SBChannelList)(({ theme }) => ({
  width: "100%", // Full width for mobile
}));

const SendbirdChat = () => {
  const [currentChannel, setCurrentChannel] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isMessageInputDisabled, setMessageInputDisabled] = useState(true);
  // Add keyboard visibility state
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const containerRef = useRef(null);

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
      // More accurate keyboard detection that accounts for bottom menu
      const visualViewportHeight =
        window.visualViewport?.height || window.innerHeight;
      const isKeyboardVisible =
        visualViewportHeight < window.screen.height - 200;

      setKeyboardVisible(isKeyboardVisible);
      document.body.classList.toggle("keyboard-visible", isKeyboardVisible);

      if (isKeyboardVisible && containerRef.current) {
        containerRef.current.style.transform = "translateY(0)";
      }
    };

    // Use visualViewport API if available for more accurate detection
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    } else {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      } else {
        window.removeEventListener("resize", handleResize);
      }
      document.body.classList.remove("keyboard-visible");
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
    <MobileContainer
      ref={containerRef}
      style={{
        marginBottom: "60px", // Reserve space for bottom menu
        height: keyboardVisible
          ? `calc(100vh - 60px - ${
              window.visualViewport?.height
                ? window.screen.height - window.visualViewport.height
                : 250
            }px)`
          : "calc(100vh - 60px)",
      }}
    >
      {!currentChannel ? (
        renderChannelList
      ) : (
        <ConversationWrapper>{renderConversation}</ConversationWrapper>
      )}

      <KeyboardSpacer />
    </MobileContainer>
  );

  return <Container>{!isMobile ? renderDesktop() : renderMobile()}</Container>;
};

export default SendbirdChat;
