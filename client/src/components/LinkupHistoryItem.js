import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import {
  CheckCircleOutlined,
  CloseOutlined,
  QueryBuilderOutlined,
} from "@material-ui/icons";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import nlp from "compromise";
const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  linkupHistoryItem: {
    backgroundColor: "#fff",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderBottom: "1px solid lightgrey",
  },
  postDetails: {
    display: "flex",
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
}));

const LinkupHistoryItem = ({ post, userID }) => {
  const classes = useStyles();
  const [isMyLinkup, setIsMyLinkup] = useState(false);

  const {
    creator_id,
    creator_name,
    avatar,
    gender_preference,
    activity,
    location,
    date,
    status,
  } = post;

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
    } else if (status === "accepted") {
      return "Linked Up";
    } else if (status === "expired") {
      return "expired";
    }
    return null;
  };

  const getStatusChipClass = () => {
    if (status === "active") {
      return classes.pendingChip;
    } else if (status === "accepted") {
      return classes.acceptedChip;
    } else if (status === "expired") {
      return classes.declinedChip;
    }
    return null;
  };

  useEffect(() => {
    if (userID === creator_id) {
      setIsMyLinkup(true);
    }
  }, [creator_id, userID]);

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

    if (status === "active" || status === "accepted") {
      linkupItemText = `You are trying to link up ${activityText.toLowerCase()} on ${dateText} ${timeText}
      with a gender preference for ${gender_preference}.`;
    } else if (status === "accepted" && !isMyLinkup) {
      linkupItemText = `You've linked up with ${creator_name} ${activityText.toLowerCase()} and it's scheduled for 
          ${dateText} ${timeText}.`;
    } else if (status === "expired") {
      linkupItemText = `Link up ${activityText.toLowerCase()} on 
          ${dateText} ${timeText} has expired.`;
    } else {
      linkupItemText = "";
    }

    return linkupItemText;
  };

  return (
    <div className={classes.linkupHistoryItem}>
      <Avatar alt={creator_name} src={avatar} className={classes.avatar} />

      <div className={classes.postDetails}>
        <div>
          <p className={classes.requestText}>{renderLinkupItemText()}</p>
          {isMyLinkup && (
            <Typography variant="subtitle2" component="details">
              <span>{location}</span>
            </Typography>
          )}
        </div>
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
