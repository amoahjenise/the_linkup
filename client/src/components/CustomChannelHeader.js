import React, { useCallback, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Avatar, Box, Typography } from "@mui/material";
import HorizontalMenu from "./HorizontalMenu"; // Adjust the path as necessary
import moment from "moment";
import LoadingSpinner from "./LoadingSpinner";
import { getRequestByLinkupIdAndSenderId } from "../api/linkupRequestAPI";
import nlp from "compromise";
import UserAvatar from "./UserAvatar";

const compromise = nlp;

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  borderBottomWidth: "1px",
  borderBottom: "0.1px solid #lightgray",
  boxShadow: "0 1px 1px rgba(0, 0, 0, 0.12)",
}));

const ChannelInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: theme.spacing(2),
  width: theme.spacing(7),
  height: theme.spacing(7),
}));

const Nickname = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "1.2rem",
}));

const Status = styled(Typography)(({ theme, statusColor }) => ({
  display: "inline-block",
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  fontWeight: "bold",
  textTransform: "capitalize",
  backgroundColor: statusColor.background,
  color: statusColor.color,
}));

const statusColors = {
  pending: { background: "#ffd700", color: "#333" },
  accepted: { background: "#28a745", color: "#fff" },
  declined: { background: "#dc3545", color: "#fff" },
  expired: { background: "#6c757d", color: "#fff" },
};

const CustomChannelHeader = ({
  linkup,
  channel,
  onActionClick,
  isOperator,
  loading,
}) => {
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

  const renderName = () => {
    if (isOperator) {
      return linkup?.requester_name;
    } else {
      return operator.nickname;
    }
  };

  const renderUserData = () => {
    if (isOperator) {
      return {
        id: linkup?.requester_id,
        name: linkup?.requester_name,
        avatar: linkup?.requester_avatar,
      };
    } else {
      return {
        id: linkup?.creator_id,
        name: linkup?.creator_name,
        avatar: linkup?.avatar,
      };
    }
  };

  const renderAvatar = () => {
    if (isOperator) {
      return linkup?.requester_avatar;
    } else {
      return linkup?.avatar;
    }
  };

  return (
    <Header>
      {loading ? (
        <LoadingSpinner />
      ) : (
        !loading && (
          <ChannelInfo>
            {operator && (
              <>
                {/* <StyledAvatar src={renderAvatar()} alt={renderName()} /> */}
                <UserAvatar
                  userData={renderUserData()}
                  width="60px"
                  height="60px"
                />
                <Box>
                  <Nickname>{renderName()}</Nickname>
                  <Box>{renderLinkupItemText()}</Box>
                  {linkup?.request_status && (
                    <Status
                      statusColor={statusColors[linkupRequestStatus] || {}}
                    >
                      {linkupRequestStatus}
                    </Status>
                  )}
                </Box>
              </>
            )}
          </ChannelInfo>
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
    </Header>
  );
};

export default CustomChannelHeader;
