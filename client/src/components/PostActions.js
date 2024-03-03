import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faHeart,
  faShare,
} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
  actionButton: {
    fontSize: "14px",
    margin: "0 20px",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  requestButton: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
    marginRight: "16px",
  },
  icon: {
    marginRight: "4px",
  },
});

const PostActions = ({ onRequestClick, disableRequest }) => {
  const classes = useStyles();

  // Handle the request click event
  const handleRequestClick = () => {
    // Call the onRequestClick function when the request icon is clicked
    onRequestClick();
  };

  return (
    <div className={classes.root}>
      <div
        aria-expanded="false"
        aria-haspopup="menu"
        aria-label="Request"
        role="button"
        tabIndex="0"
        className={classes.requestButton}
        onClick={handleRequestClick}
      >
        <FontAwesomeIcon icon={faEnvelope} className={classes.icon} />
        {disableRequest ? "Request Sent" : "Request"}
      </div>

      {/* <SplitBillIcon
        person1Color="pink"
        person2Color="blue"
        width="40px"
        height="40px"
      /> */}
      {/* <PaymentIcon width="40px" height="40px" color="blue" fontSize="35px" /> */}
      {/* <div
        aria-expanded="false"
        aria-haspopup="menu"
        aria-label="Like"
        role="button"
        tabIndex="1"
        className={classes.actionButton}
      >
        <FontAwesomeIcon icon={faHeart} className={classes.icon} />
        Like
      </div>
      <div
        aria-expanded="false"
        aria-haspopup="menu"
        aria-label="Share post"
        role="button"
        tabIndex="2"
        className={classes.actionButton}
      >
        <FontAwesomeIcon icon={faShare} className={classes.icon} />
        Share Post
      </div> */}
    </div>
  );
};

export default PostActions;
