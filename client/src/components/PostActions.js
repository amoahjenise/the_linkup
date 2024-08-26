import React from "react";
import { styled } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEnvelope,
  faHeart,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { useSnackbar } from "../contexts/SnackbarContext";

const Root = styled("div")({
  display: "flex",
});

const ActionButton = styled("div")({
  fontSize: "14px",
  margin: "0 20px",
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
});

const RequestButton = styled("div")({
  display: "flex",
  alignItems: "center",
  fontSize: "14px",
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
  marginRight: "16px",
});

const Icon = styled(FontAwesomeIcon)({
  marginRight: "4px",
});

const PostActions = ({ onRequestClick, disableRequest }) => {
  const { addSnackbar } = useSnackbar();

  // Handle the request click event
  const handleRequestClick = () => {
    // Call the onRequestClick function when the request icon is clicked
    onRequestClick();
  };

  return (
    <Root>
      <RequestButton
        aria-expanded="false"
        aria-haspopup="menu"
        aria-label="Request"
        role="button"
        tabIndex="0"
        onClick={handleRequestClick}
      >
        <Icon
          icon={disableRequest ? faClock : faEnvelope}
          style={{ color: disableRequest ? "#A4B96B" : "#2DBFBF" }}
        />
        {disableRequest ? "Sent" : "Join"}
      </RequestButton>

      {/* Uncomment and add more action buttons if needed */}

      <ActionButton
        aria-expanded="false"
        aria-haspopup="menu"
        aria-label="Like"
        role="button"
        tabIndex="1"
        onClick={() => {
          addSnackbar("Like feature coming soon!");
        }}
      >
        <Icon icon={faHeart} style={{ color: "red" }} />
        Like
      </ActionButton>
      <ActionButton
        aria-expanded="false"
        aria-haspopup="menu"
        aria-label="Share post"
        role="button"
        tabIndex="2"
        onClick={() => {
          addSnackbar("Share post feature coming soon!");
        }}
      >
        <Icon icon={faShare} style={{ color: "blue" }} />
        Share Post
      </ActionButton>
    </Root>
  );
};

export default PostActions;
