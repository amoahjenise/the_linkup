import { useEffect } from "react";
import GroupChannelHandler from "@sendbird/uikit-react/handlers/GroupChannelHandler";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";
import sendbirdSelectors from "@sendbird/uikit-react/sendbirdSelectors";

const useSendbirdHandlers = (onUnreadMessageCountUpdate) => {
  const sendbirdContext = useSendbirdStateContext();
  const sdk = sendbirdSelectors.getSdk(sendbirdContext);

  useEffect(() => {
    if (!sdk || !sdk.groupChannel) return;

    const UNIQUE_HANDLER_ID = `handler_${new Date().getTime()}_${Math.random()}`;
    const groupChannelHandler = new GroupChannelHandler();

    groupChannelHandler.onMessageReceived = (channel, message) => {
      onUnreadMessageCountUpdate(channel);
    };

    groupChannelHandler.onChannelChanged = (channel) => {
      onUnreadMessageCountUpdate(channel);
    };

    sdk.groupChannel.addGroupChannelHandler(
      UNIQUE_HANDLER_ID,
      groupChannelHandler
    );

    return () => {
      sdk.groupChannel.removeGroupChannelHandler(UNIQUE_HANDLER_ID);
    };
  }, [sdk, onUnreadMessageCountUpdate]);
};

export default useSendbirdHandlers;
