import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  acceptLinkupRequest,
  declineLinkupRequest,
} from "../api/linkupRequestAPI";
import UserAvatar from "./UserAvatar";
import Chip from "@material-ui/core/Chip";
import {
  CheckCircleOutlined,
  CloseOutlined,
  QueryBuilderOutlined,
} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { useSnackbar } from "../contexts/SnackbarContext";
import Typography from "@material-ui/core/Typography";
import nlp from "compromise";
const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  linkupRequestItem: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderBottomWidth: "1px",
    borderBottomColor: "1px solid #D3D3D3",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chip: {
    width: "110px",
    marginR: "auto",
  },
  pendingChip: {
    backgroundColor: "#f1c40f", // Yellow
    color: theme.palette.text.secondary,
  },
  acceptedChip: {
    backgroundColor: "#2ecc71", // Green
    color: theme.palette.text.secondary,
  },
  declinedChip: {
    backgroundColor: "pink", // Pink
    color: theme.palette.text.secondary,
  },
  requestText: {
    margin: 0,
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  acceptButton: {
    backgroundColor: "#00CFFF",
    color: "white",
    marginRight: theme.spacing(2),
    cursor: "pointer",
    transition: "background-color 0.3s ease", // Add transition for smooth color change
    "&:hover": {
      backgroundColor: "#00BFFF", // Change to the darker blue color on hover
    },
  },
  buttonGroup: {
    display: "flex",
    marginTop: theme.spacing(1),
    "& > *": {
      marginRight: theme.spacing(1),
    },
  },
}));

const LinkupRequestItem = ({ post, setShouldFetchLinkups }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id || "";
  const [isMyLinkup, setIsMyLinkup] = useState(userId === post.creator_id);
  const { addSnackbar } = useSnackbar();

  const handleAcceptClick = async () => {
    try {
      await acceptLinkupRequest(post.id);
      dispatch({
        type: "UPDATE_REQUEST_STATUS",
        payload: { id: post.id, status: "accepted" },
      });
      setShouldFetchLinkups(true);
      addSnackbar("Link-up request accepted.");
    } catch (error) {
      addSnackbar(error.message);
    }
  };

  const handleDeclineClick = async () => {
    try {
      await declineLinkupRequest(post.id);
      dispatch({
        type: "UPDATE_REQUEST_STATUS",
        payload: { id: post.id, status: "declined" },
      });
      setShouldFetchLinkups(true);
      addSnackbar("Link-up request declined.");
    } catch (error) {
      addSnackbar(error.message);
    }
  };

  const renderStatusIcon = () => {
    switch (post.status) {
      case "pending":
        return <QueryBuilderOutlined />;
      case "accepted":
        return <CheckCircleOutlined />;
      case "declined":
        return <CloseOutlined />;
      case "expired":
        return <CloseOutlined />;
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    switch (post.status) {
      case "pending":
        return "pending";
      case "accepted":
        return "accepted";
      case "declined":
        return "declined";
      case "expired":
        return "Expired";
      default:
        return null;
    }
  };

  const getStatusChipClass = () => {
    switch (post.status) {
      case "pending":
        return `${classes.chip} ${classes.pendingChip}`;
      case "accepted":
        return `${classes.chip} ${classes.acceptedChip}`;
      case "declined":
        return `${classes.chip} ${classes.declinedChip}`;
      case "expired":
        return `${classes.chip} ${classes.declinedChip}`;
      default:
        return null;
    }
  };

  const renderLinkupItemText = () => {
    const doc = compromise(post.activity);
    const startsWithVerb = doc.verbs().length > 0;
    const isVerbEndingWithIng = post.activity.endsWith("ing");

    let activityText = "";
    if (post.activity) {
      if (isVerbEndingWithIng) {
        activityText = `for ${post.activity}`;
      } else {
        activityText = `${startsWithVerb ? "to" : "for"} ${post.activity}`;
      }
    }

    const dateText = post.link_up_date
      ? `${moment(post.link_up_date).format("MMM DD, YYYY")} (${moment(
          post.link_up_date
        ).format("h:mm A")})`
      : "";

    if (userId === post.receiver_id) {
      return `You received a request from ${post.requester_name} ${activityText} scheduled for ${dateText}`;
    } else {
      return `Request sent to ${post.creator_name} ${activityText} scheduled for ${dateText}`;
    }
  };

  useEffect(() => {
    setIsMyLinkup(userId === post.creator_id);
  }, [post.creator_id, userId]);

  return (
    <div className={classes.linkupRequestItem}>
      <div>
        <UserAvatar
          userData={{
            id: isMyLinkup ? post.requester_id : post.creator_id,
            name: isMyLinkup ? post.requester_name : post.creator_name,
            avatar: isMyLinkup ? post.receiver_avatar : post.avatar,
          }}
          width="40px"
          height="40px"
        />
        <div>
          <p className={classes.requestText}>{renderLinkupItemText()}</p>
          {isMyLinkup ||
            (post.status === "accepted" && (
              <Typography variant="subtitle2" component="details">
                <span>{post.location}</span>
              </Typography>
            ))}
        </div>
      </div>

      {userId === post.receiver_id ? (
        <div>
          {post.status === "pending" ? (
            <div className={classes.buttonGroup}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleAcceptClick}
                className={classes.acceptButton}
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
  );
};

export default LinkupRequestItem;
