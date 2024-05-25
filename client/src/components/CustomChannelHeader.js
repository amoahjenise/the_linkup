import React, { useCallback, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import HorizontalMenu from "./HorizontalMenu"; // Adjust the path as necessary
import moment from "moment";
import LoadingSpinner from "./LoadingSpinner";
import { getRequestByLinkupIdAndSenderId } from "../api/linkupRequestAPI";
import nlp from "compromise";

const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    borderBottomWidth: "1px",
    borderBottom: "0.1px solid #lightgray",
    boxShadow: "0 1px 1px rgba(0, 0, 0, 0.12)",
  },
  channelInfo: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    marginRight: theme.spacing(2),
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  nickname: {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  status: {
    display: "inline-block",
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  pending: {
    backgroundColor: "#ffd700",
    color: "#333",
  },
  accepted: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
  declined: {
    backgroundColor: "#dc3545",
    color: "#fff",
  },
  expired: {
    backgroundColor: "#6c757d",
    color: "#fff",
  },
}));

const CustomChannelHeader = ({
  linkup,
  channel,
  onActionClick,
  isOperator,
  loading,
}) => {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [linkupRequestStatus, setLinkupRequestStatus] = useState(null);
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(false);

  const operator = channel.members.find((member) => member.role === "operator");

  const fetchLinkupRequest = useCallback(async () => {
    try {
      if (linkup && shouldFetchLinkups) {
        // Fetch the linkup request by linkup id and sender id
        const response = await getRequestByLinkupIdAndSenderId(
          linkup.id,
          linkup.requester_id
        );
        setLinkupRequestStatus(response.linkupRequest.status); // Update the status using linkupRequest.status
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [linkup, shouldFetchLinkups]);

  // useEffect to set initial linkup request status on mount
  useEffect(() => {
    if (linkup) setLinkupRequestStatus(linkup.request_status);
  }, [linkup]);

  useEffect(() => {
    if (shouldFetchLinkups) {
      fetchLinkupRequest();
      setShouldFetchLinkups(false);
    }
  }, [fetchLinkupRequest, shouldFetchLinkups]);

  const renderLinkupItemText = () => {
    if (linkup) {
      const doc = compromise(linkup.activity);
      const startsWithVerb = doc.verbs().length > 0;
      const isVerbEndingWithIng = linkup.activity.endsWith("ing");

      let activityText = "";
      if (linkup.activity) {
        if (isVerbEndingWithIng) {
          activityText = `for ${linkup.activity}`;
        } else {
          activityText = `${startsWithVerb ? "to" : "for"} ${linkup.activity}`;
        }
      }

      const dateText = linkup.date
        ? `${moment(linkup.date).format("MMM DD, YYYY")} (${moment(
            linkup.date
          ).format("h:mm A")})`
        : "";

      if (isOperator) {
        return `Would like to join you ${activityText} scheduled for ${dateText}`;
      } else {
        return `You sent a request for the linkup event: ${linkup.activity} scheduled for ${dateText}`;
      }
    }
    return "";
  };

  const renderAvatar = () => {
    if (isOperator) {
      return linkup?.requester_avatar;
    } else {
      return linkup?.avatar;
    }
  };

  return (
    <div className={classes.header}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        !loading && (
          <div className={classes.channelInfo}>
            {operator && (
              <>
                <Avatar
                  src={renderAvatar()}
                  alt={operator.nickname}
                  className={classes.avatar}
                />
                <div>
                  <div className={classes.nickname}>
                    {linkup?.requester_name}
                  </div>
                  <div>{renderLinkupItemText()}</div>
                  {linkup?.request_status && (
                    <div
                      className={`${classes.status} ${
                        classes[linkupRequestStatus] // Change this line
                      }`}
                    >
                      {linkupRequestStatus}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )
      )}
      {/* <IconButton className={classes.iconButton} onClick={onActionClick}>
        <InfoIcon />
      </IconButton> */}
      {isOperator && (
        <HorizontalMenu
          showGoToItem={true}
          showGoToRequest={true}
          showEditItem={false}
          showDeleteItem={false}
          showCloseItem={false}
          showCheckInLinkup={false}
          showAcceptLinkupRequest={false}
          showDeclineLinkupRequest={false}
          linkupItem={linkup}
          menuAnchor={menuAnchor}
          setMenuAnchor={setMenuAnchor}
          setShouldFetchLinkups={setShouldFetchLinkups}
        />
      )}
    </div>
  );
};

export default CustomChannelHeader;
