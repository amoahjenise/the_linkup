import { ADD_SENT_REQUEST } from "../actions/actionTypes";

const initialState = [];

const userSentRequestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SENT_REQUEST:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default userSentRequestsReducer;
