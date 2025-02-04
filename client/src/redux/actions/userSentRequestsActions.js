import {
  FETCH_LINKUP_REQUESTS_SUCCESS,
  FETCH_LINKUP_REQUESTS_ERROR,
} from "./actionTypes";
import { ADD_SENT_REQUEST } from "./actionTypes";

export const addSentRequest = (linkupId) => {
  return {
    type: ADD_SENT_REQUEST,
    payload: linkupId,
  };
};

export const fetchLinkupRequestsSuccess = (linkupRequestList) => {
  return {
    type: FETCH_LINKUP_REQUESTS_SUCCESS,
    payload: linkupRequestList,
  };
};

export const fetchLinkupRequestsError = (error) => {
  return {
    type: FETCH_LINKUP_REQUESTS_ERROR,
    payload: error,
  };
};
