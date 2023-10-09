// selectors/conversationSelectors.js
export const selectConversations = (state) => state.conversation.conversations;
export const selectSelectedConversation = (state) =>
  state.conversation.selectedConversation;
export const selectMessages = (state) => state.conversation.messages;
export const selectLinkupId = (state) => state.conversation.linkupId;
