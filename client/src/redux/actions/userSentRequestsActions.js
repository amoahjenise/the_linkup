// actions/userSentRequestsActions.js

import { ADD_SENT_REQUEST } from "./actionTypes";

export const addSentRequest = (linkupId) => {
  return {
    type: ADD_SENT_REQUEST,
    payload: linkupId,
  };
};
