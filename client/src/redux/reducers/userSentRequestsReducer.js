import {
  ADD_SENT_REQUEST,
  FETCH_LINKUP_REQUESTS_SUCCESS,
} from "../actions/actionTypes";

const initialState = [];

const userSentRequestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SENT_REQUEST:
      return [...state, action.payload];
    case FETCH_LINKUP_REQUESTS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export default userSentRequestsReducer;
