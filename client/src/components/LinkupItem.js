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
import ReceiptIcon from "@material-ui/icons/Receipt";

const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  postedTimeText: {
    color: "#8e8e8e",
    fontSize: "14px",
    fontWeight: "normal",
    marginTop: "5px",
    letterSpacing: "0.5px",
  },
  boldText: {
    fontWeight: "bold",
  },
  usernameLink: {
    textDecoration: "none",
    fontWeight: "bold",
  },
  highlightedLinkupItem: {
    backgroundColor: "rgba(200, 200, 200, 0.1)",
    transition: "background-color 0.2s ease",
  },
  menuContainer: {
    padding: theme.spacing(3),
    position: "absolute",
    top: 0,
    right: 0,
  },
  linkupItem: {
    width: "100%",
    position: "relative",
    padding: theme.spacing(2),
    wordWrap: "break-word",
    borderBottom: "1px solid #ccc",
    cursor: "pointer",
  },
  postActions: {
    fontSize: "12px",
    marginTop: "25px",
  },
  linkupInfo: {
    margin: "10px",
    display: "flex",
    flexDirection: "column",
  },
  itemFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
  },
  paymentOptionIconContainer: {
    display: "inline-block", // Ensures the container wraps around the emoji
  },
  paymentOptionIcon: {
    cursor: "default", // Makes the emoji a pointer when hovered over
  },
}));

const LinkupItem = React.memo(
  ({ linkupItem, setShouldFetchLinkups, disableRequest }) => {
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
              aria-label="watery eyes"
              style={{ fontSize: "30px" }}
            >
              <ReceiptIcon />
              <ReceiptIcon />
            </span>
          );
        case "iWillPay":
          return (
            <span
              title="I'll pay!"
              role="img"
              aria-label="watery eyes"
              style={{ fontSize: "30px" }}
            >
              <ReceiptIcon />
            </span>
          );
        case "pleasePay":
          return (
            <span className={classes.paymentOptionIconContainer}>
              <span
                title="Please pay"
                role="img"
                aria-label="watery eyes"
                style={{ fontSize: "30px" }}
                className={classes.paymentOptionIcon}
              >
                🥹
              </span>{" "}
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
            <strong>{creator_name}</strong>
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
        className={`${
          isHovered || linkupItem.id === editingLinkup?.linkup?.id
            ? classes.highlightedLinkupItem
            : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={classes.linkupItem}>
          <div className={classes.menuContainer}>
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
          <div>
            <UserAvatar
              userData={{
                id: creator_id,
                name: creator_name,
                avatar: avatar,
              }}
              width="50px"
              height="50px"
            />
            <div className={classes.linkupInfo}>
              <div>{renderLinkupItemText()}</div>
              <div className={classes.itemFooter}>
                <div>
                  <span className={classes.postedTimeText}>
                    Posted {getTimeAgo(created_at)}
                  </span>
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
                  </div>
                </div>
                <div>{renderPaymentOptionIcon()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default LinkupItem;
