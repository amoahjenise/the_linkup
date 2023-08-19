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
  linkupHistoryItem: {
    backgroundColor: "#fff",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(1),
    border: "1px solid lightgrey",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  postDetails: {
    display: "flex",
    alignItems: "center",
    color: theme.palette.text.secondary,
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

const LinkupHistoryItem = ({ post }) => {
  const classes = useStyles();

  const { creator_name, avatar, activity, location, date, status } = post;

  const renderStatusIcon = () => {
    if (status === "active") {
      return <QueryBuilderOutlined />;
    } else if (status === "Accepted") {
      return <CheckCircleOutlined />;
    } else if (status === "expired") {
      return <CloseOutlined />;
    }
    return null;
  };

  const getStatusLabel = () => {
    if (status === "active") {
      return "pending";
    } else if (status === "linked") {
      return "Linked Up";
    } else if (status === "expired") {
      return "expired";
    }
    return null;
  };

  const getStatusChipClass = () => {
    if (status === "active") {
      return classes.pendingChip;
    } else if (status === "Accepted") {
      return classes.acceptedChip;
    } else if (status === "expired") {
      return classes.declinedChip;
    }
    return null;
  };

  const renderLinkupItemText = () => {
    let linkupItemText = "";
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
    const dateText = date ? `${moment(date).format("MMM DD, YYYY")}` : "";
    const timeText = date ? `(${moment(date).format("h:mm A")})` : "";

    // Capitalize the first letter of each word in the location
    const formattedLocation = location
      .toLowerCase() // Convert to lowercase
      .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()); // Capitalize first letter of each word

    if (status === "active") {
      linkupItemText = `You are trying to link up ${activityText.toLowerCase()} at ${formattedLocation} on ${dateText} ${timeText}.`;
    } else if (status === "expired") {
      linkupItemText = `Link up ${activityText.toLowerCase()} at ${formattedLocation} on 
          ${dateText} ${timeText} has expired.`;
    } else {
      linkupItemText = "";
    }

    return linkupItemText;
  };

  return (
    <div className={classes.linkupHistoryItem}>
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

export default LinkupHistoryItem;
