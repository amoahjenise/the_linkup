import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import moment from "moment";
import UserAvatar from "./UserAvatar";
import HorizontalMenu from "./HorizontalMenu";
import PostActions from "./PostActions";
import nlp from "compromise";
import { useSnackbar } from "../contexts/SnackbarContext";
import { getLinkupStatus } from "../api/linkupAPI";
import { IoReceipt } from "react-icons/io5";

const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: "3rem",
    width: "3rem",
    borderRadius: "9999px",
    marginRight: "0.5rem",
  },
  container: {
    padding: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    borderBottomWidth: "1px",
    borderBottomColor: "1px solid #D3D3D3",
  },
  card: {
    border: "1px solid #d2d6dc",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    padding: "1rem",
    borderRadius: "0.375rem",
    width: "32rem",
    backgroundColor: "rgba(200, 200, 200, 0.1)",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  highlightedCard: {
    backgroundColor: "rgba(200, 200, 200, 0.2)", // Change to your desired darker color
  },
  horizontalMenu: {
    marginLeft: "auto",
  },
  userDetail: {
    display: "flex",
    flexDirection: "column",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
  },
  userName: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  postActions: {
    display: "flex",
    alignItems: "center",
    marginTop: "0.5rem",
  },
  postContent: {
    fontSize: "0.95rem",
    lineHeight: "1.25rem",
    marginTop: "1rem",
  },
  postInfo: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.9rem",
    color: "#718096",
    marginTop: "0.25rem",
  },
  onlineIndicator: {
    height: "0.75rem",
    marginRight: "0.125rem",
  },
  paymentOptionIcon: {
    display: "flex",
    justifyContent: "space-between",
    width: "50%",
    height: "50%",
  },
  paymentOptionIconContainer: {
    display: "inline-block", // Ensures the container wraps around the emoji
  },
}));

const LinkupItem = ({ linkupItem, setShouldFetchLinkups, disableRequest }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const loggedUser = useSelector((state) => state.loggedUser);
  const editingLinkup = useSelector((state) => state.editingLinkup);
  const { id, creator_id, creator_name, activity, created_at, date, avatar } =
    linkupItem;
  const [menuAnchor, setMenuAnchor] = useState(null);
  const { addSnackbar } = useSnackbar();

  // Function to render the appropriate icon based on the payment option
  const renderPaymentOptionIcon = () => {
    switch (linkupItem.payment_option) {
      case "split":
        return (
          <span
            title="Lets split the bill!"
            role="img"
            aria-label="split the bill"
            style={{ fontSize: "30px" }}
          >
            <div className={classes.paymentOptionIcon}>
              <IoReceipt />
              <IoReceipt />
            </div>
          </span>
        );
      case "iWillPay":
        return (
          <span
            title="I'll pay!"
            role="img"
            aria-label="i'll pay"
            style={{ fontSize: "30px" }}
          >
            <div className={classes.paymentOptionIcon}>
              <IoReceipt />
            </div>
          </span>
        );
      case "pleasePay":
        return (
          <span className={classes.paymentOptionIconContainer}>
            <span
              title="Please pay"
              role="img"
              aria-label="watery eyes"
              style={{ fontSize: "20px" }}
              className={classes.paymentOptionIcon}
            >
              🥹
            </span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleRequestLinkup = async () => {
    const response = await getLinkupStatus(id);
    let message = "";

    switch (response.linkupStatus) {
      case "expired":
        message = "This linkup has expired.";
        break;
      case "closed":
        message = "This linkup was closed and can no longer receive requests.";
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
      <span>
        <Link to={`/profile/${creator_id}`} className={classes.usernameLink}>
          <strong>{creator_name}</strong>
        </Link>{" "}
        is trying to link up{" "}
        <strong className={classes.boldText}>{activityText}</strong> on{" "}
        <time className={classes.boldText}>
          {dateText} {timeText}
        </time>
        .
      </span>
    );
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
      className={classes.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`${classes.card} ${
          isHovered || linkupItem.id === editingLinkup?.linkup?.id
            ? classes.highlightedCard
            : ""
        }`}
      >
        <div className={classes.horizontalMenu}>
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
        <div className={classes.userInfo}>
          <UserAvatar
            userData={{
              id: creator_id,
              name: creator_name,
              avatar: avatar,
            }}
            width="50px"
            height="50px"
          />
          <div className={classes.userDetail}>
            <div className={classes.userName}>{creator_name}</div>
            <div className={classes.postInfo}>
              <span>{getTimeAgo(created_at)}</span>
            </div>
          </div>
        </div>
        <p className={classes.postContent}>{renderLinkupItemText()}</p>
        <div className={classes.postActions}>
          {loggedUser.user.id !== linkupItem.creator_id && (
            <div>
              <div>
                <PostActions
                  paymentOption={linkupItem.payment_option}
                  onRequestClick={handleRequestLinkup}
                  disableRequest={disableRequest}
                />
              </div>
            </div>
          )}
          <span> {renderPaymentOptionIcon()}</span>
        </div>
      </div>
    </div>
  );
};

export default LinkupItem;
