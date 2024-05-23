import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import HorizontalMenu from "./HorizontalMenu"; // Adjust the path as necessary
import moment from "moment";
import LoadingSpinner from "./LoadingSpinner";
import {
  acceptLinkupRequest,
  declineLinkupRequest,
} from "../api/linkupRequestAPI";
import { useColorMode } from "@chakra-ui/react";
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
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(false);
  const { colorMode } = useColorMode();

  const operator = channel.members.find((member) => member.role === "operator");

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
      return `Link up ${activityText} scheduled for ${dateText}`;
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
                  src={linkup?.avatar || operator.plainProfileUrl}
                  alt={operator.nickname}
                  className={classes.avatar}
                />
                <div>
                  <div className={classes.nickname}>{operator.nickname}</div>
                  <div>{renderLinkupItemText()}</div>
                  {linkup?.request_status && (
                    <div
                      className={`${classes.status} ${
                        classes[linkup.request_status]
                      }`}
                    >
                      {linkup.request_status}
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
          showEditItem={true}
          showDeleteItem={false}
          showCloseItem={false}
          showCheckInLinkup={false}
          showAcceptLinkupRequest={true}
          showDeclineLinkupRequest={true}
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
