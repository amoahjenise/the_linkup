import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import SBConversation from "@sendbird/uikit-react/GroupChannel";
import SBChannelList from "@sendbird/uikit-react/GroupChannelList";
import SBChannelSettings from "@sendbird/uikit-react/ChannelSettings";
import sendbirdSelectors from "@sendbird/uikit-react/sendbirdSelectors";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";
import { getChannelFirstTwoMessages } from "../api/sendbirdAPI";
import { getLinkupByConversation } from "../api/messagingAPI";
import ChannelListHeader from "./ChannelListHeader";
import CustomChannelHeader from "./CustomChannelHeader";

const useStyles = makeStyles((theme) => ({
  SendbirdChat: {
    height: "calc(100vh - 60px)",
    display: "flex",
    borderWidth: "0px",
  },
  settingsPanelWrap: {
    flex: "0 0 auto",
  },
}));

export default function SendbirdChat() {
  const classes = useStyles();
  const [showSettings, setShowSettings] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [isMessageInputDisabled, setMessageInputDisabled] = useState(true);
  const [isOperator, setIsOperator] = useState(null);
  const [linkup, setLinkup] = useState(null);
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id;
  const globalStore = useSendbirdStateContext();
  const getGroupChannel = sendbirdSelectors.getGetGroupChannel(globalStore);

  useEffect(() => {
    if (currentChannel?._url) {
      const fetchChannelData = async () => {
        try {
          const linkupResponse = await getLinkupByConversation(
            currentChannel._url
          );

          setLinkup(linkupResponse.linkup);

          const channel = await getGroupChannel(currentChannel._url);

          const operator = channel?.members.find(
            (member) => member.role === "operator"
          );

          const isOperatorValue = operator && operator.userId === userId;

          setIsOperator(isOperatorValue);

          const response = await getChannelFirstTwoMessages(
            currentChannel._url,
            channel.createdAt
          );

          if (linkupResponse.linkup.request_status === "declined") {
            setMessageInputDisabled(true);
          } else if (
            !isOperatorValue &&
            response.messages.length === 1 &&
            linkupResponse.linkup.request_status !== "accepted"
          ) {
            setMessageInputDisabled(true);
          } else {
            setMessageInputDisabled(false);
          }
        } catch (error) {
          console.error("Error fetching channel:", error);
        }
      };

      fetchChannelData();
    }
  }, [currentChannel]);

  return (
    <div className={classes.SendbirdChat}>
      <div className="sendbird-app__wrap">
        <div className="" style={{ borderWidth: "0px" }}>
          <SBChannelList
            allowProfileEdit={false}
            isMessageReceiptStatusEnabled={true}
            isTypingIndicatorEnabled={true}
            selectedChannelUrl={currentChannel?._url}
            onChannelCreated={(channel) => setCurrentChannel(channel)}
            onChannelSelect={(channel) => setCurrentChannel(channel)}
            renderHeader={() => <ChannelListHeader />}
          />
        </div>
        <div
          className="sendbird-app__conversation-wrap"
          style={{
            borderWidth: "0px",
            borderLeftColor: "0.1px solid lightgrey",
            borderLeftWidth: "1px",
          }}
        >
          {currentChannel?._url && (
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
                />
              )}
            />
          )}
        </div>
      </div>
      {showSettings && (
        <div className={classes.settingsPanelWrap}>
          <SBChannelSettings
            channelUrl={currentChannel?._url}
            onCloseClick={() => setShowSettings(false)}
          />
        </div>
      )}
    </div>
  );
}
