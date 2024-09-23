import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Button, TextField, Avatar } from "@mui/material";
import moment from "moment";
import { sendRequest } from "../api/linkupRequestAPI";
import { addSentRequest } from "../redux/actions/userSentRequestsActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import {
  createGroupChannel,
  sendMessage,
  sendInvitation,
} from "../api/sendbirdAPI";
import { getRequestByLinkupIdAndSenderId } from "../api/linkupRequestAPI";
import { getLinkupStatus } from "../api/linkUpAPI";

const SendRequestContainer = styled("div")({
  display: "flex",
  height: "100vh",
});

const MainSection = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const LinkUpInfo = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: "20px",
  textAlign: "center", // Center text
}));

const StyledTextField = styled(TextField)(({ theme, textColor }) => ({
  marginBottom: theme.spacing(2),
  width: "90%",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#D3D3D3",
    },
    "&:hover fieldset": {
      borderColor: "#D3D3D3",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0097A7",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#B0B0B0", // Lighter gray color for label
  },
  "& .MuiInputBase-input": {
    color: textColor,
  },
}));

const SendButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: "40px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  backgroundColor: "#0097A7",
  fontWeight: "bold",
  color: "white",
  "&:hover": {
    backgroundColor: "#007b86",
  },
  width: "200px",
  height: "60px",
  marginTop: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  marginBottom: theme.spacing(2),
}));

const RequestBestPractices = styled("div")(({ theme, colorMode }) => ({
  display: "flex",
  flexDirection: "column", // Stack items vertically
  fontSize: "16px",
  justifyContent: "center",
  alignItems: "flex-start", // Align text to the left
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[300]}`, // Add a border
  borderRadius: "8px", // Rounded corners'
  color: colorMode === "dark" ? "white" : "black",
  backgroundColor: "black",
  marginTop: theme.spacing(2),
}));

const SendRequest = ({ linkupId, linkups, colorMode }) => {
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const loggedUser = useSelector((state) => state.loggedUser);
  const post = linkups.find((p) => p.id === linkupId);
  const requesterId = loggedUser.user.id;
  const requesterName = loggedUser.user.name;

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const textColor = colorMode === "dark" ? "white" : "black";

  const disabledStyle = {
    color:
      colorMode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
  };

  const handleSendRequest = async () => {
    const aUsers = [requesterId, post.creator_id];

    try {
      const response = await getLinkupStatus(post.id);
      let displayMessage = "";

      switch (response.linkupStatus) {
        case "expired":
          displayMessage = "This linkup has expired.";
          break;
        case "closed":
          displayMessage =
            "This linkup was closed and can no longer receive requests.";
          break;
        case "inactive":
          displayMessage = "This linkup was deleted.";
          break;
        default:
          break;
      }

      if (displayMessage) {
        addSnackbar(displayMessage, { timeout: 7000 });
        return;
      }

      const existingRequest = await getRequestByLinkupIdAndSenderId(
        linkupId,
        requesterId
      );

      if (existingRequest.linkupRequest) {
        addSnackbar("You have already sent a request for this linkup.");
        return;
      }

      const channelResponse = await createGroupChannel(
        aUsers,
        post.creator_id,
        requesterId
      );
      const channelUrl = channelResponse.channel_url;

      await sendInvitation(channelUrl, [requesterId], post.creator_id);
      const sendMessageResponse = await sendMessage(
        requesterId,
        channelUrl,
        message
      );

      await sendRequest(
        requesterId,
        requesterName,
        post.creator_id,
        linkupId,
        message,
        channelUrl
      );

      if (sendMessageResponse.message_id) {
        dispatch(addSentRequest(linkupId));
        addSnackbar("Request sent!");
        navigate("/history/requests-sent");
      } else {
        addSnackbar("Request send failed. Please try again.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      addSnackbar("Failed to send request. Please try again.");
    }
  };

  const renderPostText = () => {
    const dateText = post.date
      ? `${moment(post.date).format("MMM DD, YYYY")}`
      : "";
    const timeText = post.date ? `(${moment(post.date).format("h:mm A")})` : "";
    return `${post.creator_name} is trying to link up for ${post.activity} on ${dateText} ${timeText}.`;
  };

  return (
    <SendRequestContainer>
      <MainSection>
        <StyledAvatar alt={post.creator_name} src={post.avatar} />
        <LinkUpInfo>
          <div>{renderPostText()}</div>
          <RequestBestPractices colorMode={colorMode}>
            <strong>To increase your chances of getting a response:</strong>
            <div>
              <strong>1. Personalize Your Message:</strong> Mention a specific
              detail about the event.
            </div>
            <div>
              <strong>2. Share Your Availability:</strong> Let them know when
              you’re free to meet up.
            </div>
            <div>
              <strong>3. Encourage Engagement:</strong> End with an open-ended
              question to encourage a reply.
            </div>
          </RequestBestPractices>
        </LinkUpInfo>
        <StyledTextField
          label="Message"
          multiline
          rows={4}
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          textColor={textColor}
        />
        <div className="cta-buttons">
          <SendButton
            variant="contained"
            color="primary"
            onClick={handleSendRequest}
            disabled={!message}
            style={!message ? disabledStyle : {}}
          >
            Send Request
          </SendButton>
        </div>
      </MainSection>
    </SendRequestContainer>
  );
};

export default SendRequest;
