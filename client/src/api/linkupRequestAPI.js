import axios from "axios";

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
  content
) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/send-request`, {
      requesterId: requesterId,
      requesterName: requester_name,
      creator_id: creator_id,
      linkupId: linkupId,
      content: content,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const approveRequest = async (requestId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/approve-request?id=${requestId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const declineRequest = async (requestId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/decline-request?id=${requestId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
