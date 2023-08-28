import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  acceptLinkupRequest,
  declineLinkupRequest,
} from "../api/linkupRequestAPI";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import {
  CheckCircleOutlined,
  CloseOutlined,
  QueryBuilderOutlined,
} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import moment from "moment";
import nlp from "compromise";
import { useSnackbar } from "../contexts/SnackbarContext";

const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  linkupRequestItem: {
    backgroundColor: "#fff",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderBottom: "1px solid lightgrey",
  },
  postDetails: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  pendingChip: {
    marginLeft: "auto",
    backgroundColor: "#f1c40f", // Yellow
    color: theme.palette.text.secondary,
  },
  acceptedChip: {
    marginLeft: "auto",
    backgroundColor: "#2ecc71", // Green
    color: theme.palette.text.secondary,
  },
  declinedChip: {
    marginLeft: "auto",
    backgroundColor: "pink", // Pink
    color: theme.palette.text.secondary,
  },
  requestDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  requestText: {
    marginRight: "auto",
    margin: 0,
    marginBottom: theme.spacing(1),
  },
  buttonGroup: {
    display: "flex",
    marginTop: theme.spacing(1),
    "& > *": {
      marginRight: theme.spacing(1),
    },
  },
}));

const LinkupRequestItem = ({ post }) => {
  const classes = useStyles();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userID = loggedUser?.user?.id || "";
  const [requestStatus, setRequestStatus] = React.useState(post.status); // Added state
  const {
    id,
    requester_name,
    creator_name,
    activity,
    avatar,
    status,
    location,
    link_up_date,
    receiver_avatar,
    receiver_id,
  } = post;
  const { addSnackbar } = useSnackbar();

  const handleAcceptClick = async () => {
    try {
      await acceptLinkupRequest(id);
      setRequestStatus("accepted"); // Update the request status in state
      addSnackbar("Link-up request accepted.");
    } catch (error) {
      addSnackbar(error.message);
    }
  };

  const handleDeclineClick = async () => {
    try {
      await declineLinkupRequest(id);
      setRequestStatus("declined"); // Update the request status in state
      addSnackbar("Link-up request declined.");
    } catch (error) {
      addSnackbar(error.message);
    }
  };

  const renderStatusIcon = () => {
    if (requestStatus === "pending") {
      return <QueryBuilderOutlined />;
    } else if (requestStatus === "accepted") {
      return <CheckCircleOutlined />;
    } else if (requestStatus === "declined") {
      return <CloseOutlined />;
    }
    return null;
  };

  const getStatusLabel = () => {
    if (requestStatus === "pending") {
      return "pending";
    } else if (requestStatus === "accepted") {
      return "accepted";
    } else if (requestStatus === "declined") {
      return "declined";
    }
    return null;
  };

  const getStatusChipClass = () => {
    if (requestStatus === "pending") {
      return classes.pendingChip;
    } else if (requestStatus === "accepted") {
      return classes.acceptedChip;
    } else if (requestStatus === "declined") {
      return classes.declinedChip;
    }
    return null;
  };

  const renderLinkupItemText = () => {
    let itemText = "";
    const doc = compromise(activity);
    const startsWithVerb = doc.verbs().length > 0;
    const isVerbEndingWithIng = activity.endsWith("ing");

    let activityText = "";
    if (activity) {
      if (isVerbEndingWithIng) {
        activityText = `for ${activity}`;
      } else {
        activityText = `${startsWithVerb ? "to" : "for"} ${activity}`;
      }
    }

    const dateText = link_up_date
      ? `${moment(link_up_date).format("MMM DD, YYYY")}`
      : "";
    const timeText = link_up_date
      ? `(${moment(link_up_date).format("h:mm A")})`
      : "";

    if (userID === receiver_id) {
      // If the logged user is the receiver of the request
      itemText = `You received a request from ${requester_name} ${activityText} at ${location} scheduled for ${dateText} ${timeText}`;
    } else {
      // If the logged user is not the receiver
      itemText = `Request sent to ${creator_name} ${activityText} scheduled for ${dateText} ${timeText}`;
    }

    return itemText;
  };

  return (
    <div className={classes.linkupRequestItem}>
      <div className={classes.postDetails}>
        <Avatar
          alt={userID === receiver_id ? requester_name : creator_name}
          src={userID === receiver_id ? receiver_avatar : avatar}
          className={classes.avatar}
        />
        <p className={classes.requestText}>{renderLinkupItemText()}</p>
        {userID === receiver_id ? (
          <div className={classes.requestDetails}>
            {requestStatus === "pending" ? ( // Display buttons only when status is pending
              <div className={classes.buttonGroup}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleAcceptClick}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={handleDeclineClick}
                >
                  Decline
                </Button>
              </div>
            ) : (
              <Chip
                label={getStatusLabel()}
                icon={renderStatusIcon()}
                variant="outlined"
                className={getStatusChipClass()}
              />
            )}
          </div>
        ) : (
          <Chip
            label={getStatusLabel()}
            icon={renderStatusIcon()}
            variant="outlined"
            className={getStatusChipClass()}
          />
        )}
      </div>
    </div>
  );
};

export default LinkupRequestItem;
