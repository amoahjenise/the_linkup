import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { LinkRounded, LinkTwoTone } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  postCard: {
    position: "relative",
    backgroundColor: "#fff",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    border: "1px solid lightgrey",
    wordWrap: "break-word",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    alignItems: "flex-start", // Align items to the top
  },
  postContent: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1, // Allow the content to grow and occupy available space
  },
  postedText: {
    color: theme.palette.text.secondary,
    marginLeft: "auto", // Push the text to the rightmost side
  },
  postDetails: {
    display: "flex",
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },
  usernameLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
    fontWeight: "bold",
    marginRight: theme.spacing(1),
  },
  iconHeader: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
  clickableLink: {
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
  },
  checkInButton: {
    marginRight: "auto", // Push the button to the leftmost side
  },
}));

const PostCard = ({ post }) => {
  const classes = useStyles();

  const {
    id,
    userId,
    sender,
    activity,
    type,
    location,
    createdAt,
    date,
    avatar,
    notificationText,
  } = post;

  const renderPostText = () => {
    if (notificationText) {
      return (
        <div className={classes.postContent}>
          <p>{notificationText}</p>
          {renderCheckInButton()}
        </div>
      );
    } else if (type === "linkup") {
      return (
        <div className={classes.postContent}>
          <p>
            <Link to={`/profile/${id}`} className={classes.usernameLink}>
              <span className={classes.boldText}>{userId}</span>
            </Link>
            linked up with{" "}
            <Link to={`/profile/${id}`} className={classes.usernameLink}>
              <span className={classes.boldText}>{sender}</span>
            </Link>{" "}
            for <span className={classes.boldText}>{activity}</span> at{" "}
            <span className={classes.boldText}>{location}</span>.
          </p>
          {renderCheckInButton()}
        </div>
      );
    } else if (type === "trylink") {
      return (
        <div className={classes.postContent}>
          <p>
            <Link to={`/profile/${id}`} className={classes.usernameLink}>
              <span className={classes.boldText}>{userId}</span>
            </Link>
            is trying to link up for{" "}
            <span className={classes.boldText}>{activity}</span> at{" "}
            <span className={classes.boldText}>{location}</span> on{" "}
            <span className={classes.boldText}>
              {moment(date).format("MMM DD, YYYY (hh:mm A)")}
            </span>
            .
          </p>
          {renderCheckInButton()}
        </div>
      );
    }
    return null;
  };

  const getRedirectPath = () => {
    if (type === "trylink") {
      return `/send-request/${id}`; // Redirect to page where user can send a request to link up
    } else {
      return `/linkup-request/${id}`; // Redirect to page where user can check-in for a link up
    }
  };

  const renderNotificationIcon = () => {
    if (type === "linkup") {
      return <LinkRounded />;
    } else if (type === "trylink") {
      return <LinkTwoTone />;
    }
    return null;
  };

  const renderCheckInButton = () => {
    if (notificationText) {
      return (
        <Button
          variant="contained"
          color="default"
          size="small"
          className={classes.checkInButton}
          component={Link}
          to={getRedirectPath()}
        >
          Check-In
        </Button>
      );
    }
    return null;
  };

  const getTimeAgo = (createdAt) => {
    const now = moment();
    const created = moment(createdAt);
    const duration = moment.duration(now.diff(created));
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className={classes.postCard}>
      <div className={classes.postContent}>
        <div className={classes.iconHeader}>
          {renderNotificationIcon()}
          <Avatar alt={userId} src={avatar} className={classes.avatar} />
        </div>
        <div className={classes.postDetails}>
          {renderPostText()}
          <p className={classes.postedText}>Posted {getTimeAgo(createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
