import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import UserAvatar from "./UserAvatar";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import {
  CheckCircleOutlined,
  CloseOutlined,
  QueryBuilderOutlined,
} from "@material-ui/icons";
import moment from "moment";
import HorizontalMenu from "./HorizontalMenu";
import nlp from "compromise";
const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  linkupHistoryItem: {
    backgroundColor: "#fff",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderBottom: "1px solid lightgrey",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkupDetails: {
    display: "flex",
    alignItems: "center",
  },
  chip: {
    width: "120px",
    marginLeft: "auto",
  },
  pendingChip: {
    backgroundColor: "#f1c40f", // Yellow
    color: theme.palette.text.secondary,
  },
  completedChip: {
    backgroundColor: "#2ecc71", // Green
    color: theme.palette.text.secondary,
  },
  declinedChip: {
    backgroundColor: "pink", // Pink
    color: theme.palette.text.secondary,
  },
}));

const LinkupHistoryItem = ({ linkup, setShouldFetchLinkups }) => {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = useState(null); // Added back menuAnchor

  const {
    creator_id,
    creator_name,
    avatar,
    gender_preference,
    activity,
    location,
    date,
    status,
  } = linkup;

  const formattedLocation = location
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const getStatusLabel = () => {
    switch (status) {
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "expired":
        return "Expired";
      default:
        return "";
    }
  };

  const getStatusChipClass = () => {
    switch (status) {
      case "active":
        return `${classes.chip} ${classes.pendingChip}`;
      case "completed":
        return `${classes.chip} ${classes.completedChip}`;
      case "expired":
        return `${classes.chip} ${classes.declinedChip}`;
      default:
        return classes.chip;
    }
  };

  const renderStatusIcon = () => {
    switch (status) {
      case "active":
        return <QueryBuilderOutlined />;
      case "completed":
        return <CheckCircleOutlined />;
      case "expired":
        return <CloseOutlined />;
      default:
        return null;
    }
  };

  const renderLinkupItemText = () => {
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

    const dateText = date ? moment(date).format("MMM DD, YYYY") : "";
    const timeText = date ? `(${moment(date).format("h:mm A")})` : "";

    if (status === "active" || status === "completed" || status === "expired") {
      return `You are trying to link up ${activityText.toLowerCase()} on ${dateText} ${timeText} with a gender preference for ${gender_preference}.`;
    } else if (status === "expired") {
      return `Link up ${activityText.toLowerCase()} on ${dateText} ${timeText} has expired.`;
    } else {
      return "";
    }
  };

  return (
    <div className={classes.linkupHistoryItem}>
      <div className={classes.itemHeader}>
        <UserAvatar
          userData={{
            id: creator_id,
            name: creator_name,
            avatar: avatar,
          }}
          width="40px"
          height="40px"
        />
        {status === "active" && (
          <HorizontalMenu
            showGoToItem={false}
            showEditItem={true}
            showDeleteItem={true}
            showCompleteItem={true}
            linkupItem={linkup}
            setShouldFetchLinkups={setShouldFetchLinkups}
            menuAnchor={menuAnchor}
            setMenuAnchor={setMenuAnchor}
          />
        )}
      </div>
      <div className={classes.linkupDetails}>
        <div>
          <p className={classes.requestText}>{renderLinkupItemText()}</p>
        </div>
        <Chip
          label={getStatusLabel()}
          icon={renderStatusIcon()}
          variant="outlined"
          className={getStatusChipClass()}
        />
      </div>
      <Typography variant="subtitle2" component="details">
        <span>{formattedLocation}</span>
      </Typography>
    </div>
  );
};

export default LinkupHistoryItem;
