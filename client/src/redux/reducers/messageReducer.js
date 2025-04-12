import {
  MARK_MESSAGES_AS_READ,
  INCREMENT_UNREAD_MESSAGES_COUNT,
  SET_UNREAD_MESSAGES_COUNT,
} from "../actions/actionTypes";

const initialState = {
  unreadMessagesCount: 0,
  conversations: {}, // Added to match your MARK_MESSAGES_AS_READ case
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_UNREAD_MESSAGES_COUNT:
      return {
        ...state,
        // Ensure count is never negative
        unreadMessagesCount: Math.max(0, Number(action.payload) || 0),
      };

    case INCREMENT_UNREAD_MESSAGES_COUNT:
      return {
        ...state,
        // Increment but ensure it doesn't go negative
        unreadMessagesCount: Math.max(0, state.unreadMessagesCount + 1),
      };

    case MARK_MESSAGES_AS_READ:
      const { conversationId } = action;
      console.log("Reducer: Marking message as read", action.payload);

      // Safely handle missing conversation data
      if (!state.conversations || !state.conversations[conversationId]) {
        return state;
      }

      const updatedConversations = {
        ...state.conversations,
        [conversationId]: {
          ...state.conversations[conversationId],
          messages: state.conversations[conversationId].messages.map(
            (message) => ({
              ...message,
              is_read: true,
            })
          ),
        },
      };

      return {
        ...state,
        conversations: updatedConversations,
        // Optionally reset unread count if marking all as read
        // unreadMessagesCount: 0
      };

    default:
      return state;
  }
};

export default messageReducer;
