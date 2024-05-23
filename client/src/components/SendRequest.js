import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";
import { sendRequest } from "../api/linkupRequestAPI";
import { addSentRequest } from "../redux/actions/userSentRequestsActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import {
  createGroupChannel,
  sendMessage,
  sendInvitation,
} from "../api/sendbirdAPI";

const useStyles = makeStyles((theme) => ({
  sendRequest: {
    display: "flex",
    height: "100vh",
  },
  mainSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  linkUpInfo: {
    marginBottom: theme.spacing(2),
  },
  messageInput: {
    marginBottom: theme.spacing(2),
  },
  sendButton: {
    marginBottom: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginBottom: theme.spacing(2),
  },
  locationDetails: {
    display: "flex",
    fontSize: theme.typography.body2.fontSize,
    // color: theme.palette.text.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
}));

const SendRequest = ({ linkupId, linkups, colorMode }) => {
  const dispatch = useDispatch();
  const { addSnackbar } = useSnackbar();
  const loggedUser = useSelector((state) => state.loggedUser);
  // Find the post by postId
  const post = linkups.find((p) => p.id === linkupId);
  const requesterId = loggedUser.user.id;
  const requesterName = loggedUser.user.name;

  const classes = useStyles();
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // useNavigate hook for navigation

  const textColor =
    colorMode === "dark"
      ? "white" // Dark mode background color with no transparency
      : "black";

  const handleSendRequest = async () => {
    const aUsers = [requesterId, post.creator_id];

    try {
      // Create the group channel and wait for its response
      const channelResponse = await createGroupChannel(
        // post.avatar,
        aUsers,
        post.creator_id,
        requesterId
      );

      // Extract the channel URL from the response
      const channelUrl = channelResponse.channel_url;

      await sendInvitation(channelUrl, [requesterId], post.creator_id);

      // Call the sendMessage function with the channel URL and the message
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
    // Replace with your logic to generate the post text
    const dateText = post.date
      ? `${moment(post.date).format("MMM DD, YYYY")}`
      : "";
    const timeText = post.date ? `(${moment(post.date).format("h:mm A")})` : "";
    return `${post.creator_name} is trying to link up for ${post.activity} on ${dateText} ${timeText}.`;
  };

  return (
    <div className={classes.sendRequest}>
      <div className={classes.mainSection}>
        <Avatar
          alt={post.creator_name}
          src={post.avatar}
          className={classes.avatar}
        />
        <div className={classes.linkUpInfo}>
          <div>{renderPostText()}</div>
          <span className={classes.locationDetails}>
            Location details will be provided if the request gets accepted.
          </span>
        </div>
        <TextField
          className={classes.messageInput}
          label="Message"
          multiline
          rows={4}
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          InputProps={{ style: { color: textColor } }}
          InputLabelProps={{ style: { color: textColor } }}
        />
        <div className="cta-buttons">
          <Button
            variant="contained"
            color="primary"
            className={classes.sendButton}
            onClick={handleSendRequest}
            disabled={!message} // Disable the button if message is empty
          >
            Send Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendRequest;
