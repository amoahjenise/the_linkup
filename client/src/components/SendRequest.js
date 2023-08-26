import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useNavigate } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import moment from "moment";
import { sendRequest } from "../api/linkupRequestAPI";
import { addSentRequest } from "../redux/actions/userSentRequestsActions";
import { useSnackbar } from "../contexts/SnackbarContext";

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
}));

const SendRequest = ({ linkupId, linkups }) => {
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

  const handleSendRequest = async () => {
    // Implement the logic to send the request with the message
    const response = await sendRequest(
      requesterId,
      requesterName,
      post.creator_id,
      linkupId,
      message
    );

    if (response.success) {
      dispatch(addSentRequest(linkupId));
      addSnackbar("Request sent!");
      navigate("/home");
    } else {
      addSnackbar("Request send failed. Please try again.");
    }
  };

  const renderPostText = () => {
    // Replace with your logic to generate the post text
    const dateText = post.date
      ? `${moment(post.date).format("MMM DD, YYYY")}`
      : "";
    const timeText = post.date ? `(${moment(post.date).format("h:mm A")})` : "";
    return `${post.creator_name} is trying to link up for ${post.activity} at ${post.location} on ${dateText} ${timeText}.`;
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
        </div>
        <TextField
          className={classes.messageInput}
          label="Message"
          multiline
          rows={4}
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="cta-buttons">
          <Button
            variant="contained"
            color="primary"
            className={classes.sendButton}
            onClick={handleSendRequest}
          >
            Send Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendRequest;
