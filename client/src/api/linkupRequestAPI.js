import axios from "axios";

// Add this configuration globally for Axios to include credentials
// axios.defaults.withCredentials = true;

const BASE_URL = process.env.REACT_APP_LINKUP_REQUESTS_SERVICE_URL;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

export const sendRequest = async (
  requesterId,
  requester_name,
  creator_id,
  linkupId,
  content,
  channel_url
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/linkup-requests/send-request`,
      {
        requesterId: requesterId,
        requesterName: requester_name,
        creator_id: creator_id,
        linkupId: linkupId,
        content: content,
        conversation_id: channel_url,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const acceptLinkupRequest = async (linkupRequestId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/linkup-requests/accept-request/${linkupRequestId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const declineLinkupRequest = async (linkupRequestId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/linkup-requests/decline-request/${linkupRequestId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSentRequests = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/linkup-requests/get-sent-requests/${userId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getReceivedRequests = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/linkup-requests/get-received-requests/${userId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getLinkupRequests = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/linkup-requests/get-linkup-requests/${userId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getRequestByLinkupIdAndSenderId = async (
  linkupId,
  requesterId
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/linkup-requests/get-request-by-linkupid-and-senderid`,
      {
        params: {
          requesterId: requesterId,
          linkupId: linkupId,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
