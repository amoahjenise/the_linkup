import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import {
  CheckCircleOutlined,
  CloseOutlined,
  QueryBuilderOutlined,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  linkUpPending: {
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

const LinkUpPending = ({ post }) => {
  const classes = useStyles();

  const { username, activity, type, location, date, status } = post;

  const renderStatusIcon = () => {
    if (status === "Pending") {
      return <QueryBuilderOutlined />;
    } else if (status === "Accepted") {
      return <CheckCircleOutlined />;
    } else if (status === "Declined") {
      return <CloseOutlined />;
    }
    return null;
  };

  const getStatusLabel = () => {
    if (status === "Pending") {
      return "Pending";
    } else if (status === "Accepted") {
      return "Linked Up";
    } else if (status === "Declined") {
      return "Didn't Link Up";
    }
    return null;
  };

  const getStatusChipClass = () => {
    if (status === "Pending") {
      return classes.pendingChip;
    } else if (status === "Accepted") {
      return classes.acceptedChip;
    } else if (status === "Declined") {
      return classes.declinedChip;
    }
    return null;
  };

  const getLinkUpText = () => {
    if (type === "trylink" && status === "Pending") {
      return ` You are trying to link up for ${activity} at ${location} ${date}.`;
    } else if (type === "linkup" && status === "Accepted") {
      return `You linked up for ${activity} at ${location} with ${username}.`;
    } else if (type === "trylink" && status === "Declined") {
      return `You did not link up for ${activity} at ${location}.`;
    } else {
      // Handle other types if needed
      return "";
    }
  };

  return (
    <div className={classes.linkUpPending}>
      <div className={classes.postDetails}>
        <Avatar
          alt={username}
          src="/path/to/profile-picture.jpg"
          className={classes.avatar}
        />
        <p>{getLinkUpText()}</p>
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

export default LinkUpPending;
