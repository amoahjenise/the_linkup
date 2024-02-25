import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import moment from "moment";
import UserAvatar from "./UserAvatar";
import HorizontalMenu from "./HorizontalMenu";
import PostActions from "./PostActions";
import LinkRounded from "@material-ui/icons/LinkRounded";
import LinkTwoTone from "@material-ui/icons/LinkTwoTone";
import nlp from "compromise";
import { useSnackbar } from "../contexts/SnackbarContext";
import { getLinkupStatus } from "../api/linkupAPI";

const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  linkupItem: {
    position: "relative",
    padding: theme.spacing(2),
    wordWrap: "break-word",
    borderBottom: "1px solid #ccc",
    alignItems: "flex-start",
  },
  postedTimeText: {
    marginLeft: "auto",
  },
  postHeaderContainer: { display: "flex", alignItems: "center" },
  linkupItemContent: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    wordWrap: "break-word",
  },
  boldText: {
    fontWeight: "bold",
  },
  iconHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  usernameLink: {
    textDecoration: "none",
    fontWeight: "bold",
  },
  postActions: {
    fontSize: "12px",
    marginTop: "25px",
  },
  buttonsContainer: {
    display: "flex",
    alignItems: "center",
  },
  highlightedLinkupItem: {
    backgroundColor: "rgba(200, 200, 200, 0.1)",
    transition: "background-color 0.2s ease",
  },
}));

const LinkupItem = React.memo(
  ({ linkupItem, setShouldFetchLinkups, disableRequest }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const loggedUser = useSelector((state) => state.loggedUser);
    const editingLinkup = useSelector((state) => state.editingLinkup);
    const {
      id,
      creator_id,
      creator_name,
      activity,
      created_at,
      date,
      avatar,
      type,
    } = linkupItem;
    const [menuAnchor, setMenuAnchor] = useState(null);
    const { addSnackbar } = useSnackbar();

    const handleRequestLinkup = async () => {
      const response = await getLinkupStatus(id);
      let message = "";

      switch (response.linkupStatus) {
        case "expired":
          message = "This linkup has expired.";
          break;
        case "closed":
          message =
            "This linkup was closed and can no longer receive requests.";
          break;
        case "inactive":
          message = "This linkup was deleted.";
          break;
        default:
          const destination = disableRequest
            ? `/history/requests-sent`
            : `/send-request/${id}`;
          navigate(destination);
          return;
      }

      if (!disableRequest) {
        setShouldFetchLinkups(true);
        addSnackbar(message, { timeout: 7000 });
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

      const dateText = date ? `${moment(date).format("MMM DD, YYYY")}` : "";
      const timeText = date ? `(${moment(date).format("h:mm A")})` : "";

      return (
        <p>
          <Link to={`/profile/${creator_id}`} className={classes.usernameLink}>
            <strong>@{creator_name}</strong>
          </Link>{" "}
          is trying to link up{" "}
          <strong className={classes.boldText}>{activityText}</strong> on{" "}
          <time className={classes.boldText}>
            {dateText} {timeText}
          </time>
          .
        </p>
      );
    };

    const renderPostIcon = () => {
      const icons = {
        linkup: <LinkRounded />,
        trylink: <LinkTwoTone />,
      };

      return icons[type] || null;
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
      <div
        className={`${classes.linkupItem} ${
          isHovered || linkupItem.id === editingLinkup?.linkup?.id
            ? classes.highlightedLinkupItem
            : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={classes.linkupItemContent}>
          <div className={classes.iconHeader}>
            <div className={classes.postHeaderContainer}>
              <UserAvatar
                userData={{
                  id: creator_id,
                  name: creator_name,
                  avatar: avatar,
                }}
                width="50px"
                height="50px"
              />
              {renderLinkupItemText()}
            </div>
            {loggedUser.user.id === linkupItem.creator_id && (
              <HorizontalMenu
                showGoToItem={true}
                showEditItem={true}
                showDeleteItem={true}
                showCloseItem={true}
                showCheckInLinkup={false}
                showAcceptLinkupRequest={false}
                linkupItem={linkupItem}
                setShouldFetchLinkups={setShouldFetchLinkups}
                menuAnchor={menuAnchor}
                setMenuAnchor={setMenuAnchor}
              />
            )}
          </div>
          <div className={classes.postActions}>
            {loggedUser.user.id !== linkupItem.creator_id ? (
              <div className={classes.buttonsContainer}>
                <PostActions
                  onRequestClick={handleRequestLinkup}
                  disableRequest={disableRequest}
                />
                <span className={classes.postedTimeText}>
                  Posted {getTimeAgo(created_at)}
                </span>
              </div>
            ) : (
              <div className={classes.buttonsContainer}>
                <span className={classes.postedTimeText}>
                  Posted {getTimeAgo(created_at)}
                </span>
              </div>
            )}
            {renderPostIcon()}
          </div>
        </div>
      </div>
    );
  }
);

export default LinkupItem;
