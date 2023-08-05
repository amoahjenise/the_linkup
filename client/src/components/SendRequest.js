import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useParams, useNavigate } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";

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

const mockUserData = {
  profileImages: [
    "https://www.gstatic.com/webp/gallery/1.jpg",
    "https://www.gstatic.com/webp/gallery/2.jpg",
    "https://www.gstatic.com/webp/gallery/3.jpg",
  ],
};

const SendRequest = ({ posts }) => {
  const { postId } = useParams();

  // Find the post by postId
  const post = posts.find((p) => p.id === postId);

  const classes = useStyles();
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleSendMessage = () => {
    // Implement the logic to send the request with the message
    console.log("Sending request:", message);
    navigate("/messages"); // Redirect to the /messages path
  };

  const renderPostText = () => {
    // Replace with your logic to generate the post text
    return `${post.username} is trying to link up today for ${post.activity} at ${post.location}.`;
  };

  return (
    <div className={classes.sendRequest}>
      <div className={classes.mainSection}>
        <Avatar
          alt={post.username}
          src={mockUserData.profileImages[0]}
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
            onClick={handleSendMessage}
          >
            Send Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendRequest;
