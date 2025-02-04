import {
  MARK_MESSAGES_AS_READ,
  INCREMENT_UNREAD_MESSAGES_COUNT,
  SET_UNREAD_MESSAGES_COUNT,
} from "../actions/actionTypes";
const initialState = {
  unreadMessagesCount: 0, // Initialize the unreadMessagesCount
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_UNREAD_MESSAGES_COUNT:
      return {
        ...state,
        unreadMessagesCount: action.payload, // Update the unreadMessagesCount
      };
    case INCREMENT_UNREAD_MESSAGES_COUNT:
      // Increment the unread messages count by one
      return {
        ...state,
        unreadMessagesCount: state.unreadMessagesCount + 1,
      };
    case MARK_MESSAGES_AS_READ:
      const { conversationId } = action;
      // Update the `is_read` property of messages in the specified conversation
      console.log("Reducer: Marking message as read", action.payload);

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
      };
    default:
      return state;
  }
};

export default messageReducer;
