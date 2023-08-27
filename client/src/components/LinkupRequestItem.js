import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import {
  CheckCircleOutlined,
  CloseOutlined,
  QueryBuilderOutlined,
} from "@material-ui/icons";
import moment from "moment";
import nlp from "compromise";
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
    alignItems: "center",
    // color: theme.palette.text.secondary,
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
}));

const LinkupRequestItem = ({ post }) => {
  const classes = useStyles();

  const { creator_name, activity, avatar, status, link_up_date } = post;

  const renderStatusIcon = () => {
    if (status === "pending") {
      return <QueryBuilderOutlined />;
    } else if (status === "accepted") {
      return <CheckCircleOutlined />;
    } else if (status === "declined") {
      return <CloseOutlined />;
    }
    return null;
  };

  const getStatusLabel = () => {
    if (status === "pending") {
      return "pending";
    } else if (status === "accepted") {
      return "accepted";
    } else if (status === "declined") {
      return "declined";
    }
    return null;
  };

  const getStatusChipClass = () => {
    if (status === "pending") {
      return classes.pendingChip;
    } else if (status === "accepted") {
      return classes.acceptedChip;
    } else if (status === "declined") {
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

    itemText = `Request sent to ${creator_name} ${activityText} scheduled for ${dateText} ${timeText}`;

    return itemText;
  };

  return (
    <div className={classes.linkupRequestItem}>
      <div className={classes.postDetails}>
        <Avatar alt={creator_name} src={avatar} className={classes.avatar} />
        <p>{renderLinkupItemText()}</p>
        <Chip
          label={getStatusLabel()}
          icon={renderStatusIcon()}
          variant="outlined"
          className={getStatusChipClass()}
        />
      </div>
    </div>
  );
};

export default LinkupRequestItem;
