import axios from "axios";

const APP_ID = process.env.REACT_APP_SENDBIRD_APP_ID;
const API_TOKEN = process.env.REACT_APP_SENDBIRD_API_TOKEN;

const handleError = (error) => {
  console.error("Error:", error);
  throw error;
};

export const createUser = async (userId, name, profileImageUrl) => {
  try {
    const response = await axios.post(
      `https://api-${APP_ID}.sendbird.com/v3/users`,
      {
        user_id: userId,
        nickname: name,
        profile_url: "",
        profile_file: profileImageUrl,
        issue_access_token: true, // Generate access token for the user
      },
      {
        headers: {
          "Api-Token": API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const createGroupChannel = async (userIds, operator, requester) => {
  try {
    const response = await axios.post(
      `https://api-${APP_ID}.sendbird.com/v3/group_channels`,
      {
        // name: channelName,
        is_distinct: false, // This will create a new group each time
        strict: true,
        users: userIds.map((userId) => ({ user_id: userId })),
        operator_ids: [operator],
      },
      {
        headers: {
          "Api-Token": API_TOKEN,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    handleError(error);
  }
};

// Function to send an invitation to members in a group channel
export const sendInvitation = async (channelUrl, users, inviterID) => {
  try {
    const invitationStatus = {};
    users.forEach((userId) => {
      invitationStatus[`user_${userId}`] = "invited_by_non_friend";
    });

    const response = await axios.post(
      `https://api-${APP_ID}.sendbird.com/v3/group_channels/${channelUrl}/invite`,
      {
        user_ids: users,
        invitation_status: invitationStatus,
        inviter_id: inviterID,
      },
      {
        headers: {
          "Api-Token": API_TOKEN,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async (requesterId, channelUrl, message) => {
  try {
    const response = await axios.post(
      `https://api-${APP_ID}.sendbird.com/v3/group_channels/${channelUrl}/messages`,
      {
        message_type: "MESG",
        user_id: requesterId,
        message: message,
      },
      {
        headers: {
          "Api-Token": API_TOKEN,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    handleError(error);
  }
};

// Function to delete a group channel
export const deleteGroupChannel = async (channelUrl) => {
  try {
    const response = await axios.delete(
      `https://api-${APP_ID}.sendbird.com/v3/group_channels/${channelUrl}`,
      {
        headers: {
          "Api-Token": API_TOKEN,
        },
      }
    );

    if (response.status === 204) {
      return { success: true };
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const getUnreadMessagesCount = async (user_id) => {
  try {
    const response = await axios.get(
      `https://api-${APP_ID}.sendbird.com/v3/users/${user_id}/unread_message_count`,
      {
        headers: {
          "Api-Token": API_TOKEN,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const getChannelFirstTwoMessages = async (channelUrl, messageTs) => {
  try {
    const response = await axios.get(
      `https://api-${APP_ID}.sendbird.com/v3/group_channels/${channelUrl}/messages`,
      {
        params: {
          message_ts: messageTs,
          prev_limit: 0,
          next_limit: 2,
          message_type: "MESG",
        },
        headers: {
          "Api-Token": API_TOKEN,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};
