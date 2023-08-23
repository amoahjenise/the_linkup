import { SET_MESSAGES_DATA } from "../actions/actionTypes";

const initialState = {
  participants: [],
  initialMessage: "",
  notificationId: null,
  linkupId: null,
};

const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGES_DATA:
      return {
        ...state,
        participants: action.payload.participants,
        initialMessage: action.payload.initialMessage,
        notificationId: action.payload.notificationId,
        linkupId: action.payload.linkupId,
      };
    default:
      return state;
  }
};

export default messagesReducer;
