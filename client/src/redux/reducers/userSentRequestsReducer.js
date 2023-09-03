import { ADD_SENT_REQUEST } from "../actions/actionTypes";
import { FETCH_LINKUP_REQUESTS_SUCCESS } from "../actions/actionTypes";

const initialState = [];

const userSentRequestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SENT_REQUEST:
      return [...state, action.payload];
    default:
      return state;
  }
};

export const fetchLinkupRequestsSuccess = (linkupRequests) => ({
  type: FETCH_LINKUP_REQUESTS_SUCCESS,
  payload: linkupRequests,
});

export default userSentRequestsReducer;
