import React, { useCallback, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreMenu from "./MoreMenu";
import moment from "moment";
import { getRequestByLinkupIdAndSenderId } from "../api/linkupRequestAPI";
import nlp from "compromise";
import UserAvatar from "./UserAvatar";
import { useNavigate } from "react-router-dom";

const compromise = nlp;

// Styled components for cleaner structure
const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 2),
  borderBottomWidth: "1px",
  borderBottom: `1px solid gray`,
  boxShadow: "0 1px 1px rgba(0, 0, 0, 0.12)",
  top: 0,
  position: "sticky",
  overflowY: "hidden",
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginRight: theme.spacing(1),
}));

const ChannelInfoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexGrow: 1,
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginLeft: theme.spacing(1.5),
}));

const Nickname = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.9rem",
}));

const ActivityText = styled(Typography)(({ theme }) => ({
  fontSize: "0.7rem",
  marginTop: theme.spacing(0.5),
  padding: "2px 0",
  margin: 0,
}));

const StatusWrapper = styled("span")(({ theme, background, color }) => ({
  display: "inline-block",
  textAlign: "center",
  marginLeft: "4px",
  padding: theme.spacing(0.25, 1),
  borderRadius: "12px",
  fontWeight: 600,
  fontSize: "0.7rem",
  textTransform: "capitalize",
  backgroundColor: background,
  color: color,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
  },
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
  isOperator,
  isMobile,
  setCurrentChannel,
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [linkupRequestStatus, setLinkupRequestStatus] = useState(null);
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(false);
  const navigate = useNavigate();

  const operator = channel?.members?.find(
    (member) => member.role === "operator"
  );

  const fetchLinkupRequest = useCallback(async () => {
    try {
      if (linkup && shouldFetchLinkups) {
        const response = await getRequestByLinkupIdAndSenderId(
          linkup.id,
          linkup.requester_id
        );
        setLinkupRequestStatus(response.linkupRequest.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [linkup, shouldFetchLinkups]);

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

      return isOperator
        ? `Would like to join you ${activityText} scheduled for ${dateText}`
        : `You sent a request for the linkup event: ${linkup.activity} scheduled for ${dateText}`;
    }
    return "";
  };

  const renderName = () =>
    isOperator ? linkup?.requester_name : operator?.nickname;

  const renderUserData = () => {
    if (!linkup)
      return {
        id: "",
        name: "",
        avatar: "",
      };
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

  const handleLinkupStatusClick = () => {
    isOperator
      ? navigate("/history/requests-received")
      : navigate("/history/requests-sent");
  };

  const statusColor = statusColors[linkupRequestStatus] || {};

  return (
    <Header>
      {isMobile && (
        <BackButton
          onClick={() => {
            setCurrentChannel(null);
          }}
        >
          <ArrowBackIcon />
        </BackButton>
      )}

      <ChannelInfoContainer>
        <UserAvatar userData={renderUserData()} width="40px" height="40px" />
        <InfoBox>
          <Nickname>
            {renderName()}{" "}
            {linkup?.request_status && (
              <StatusWrapper
                onClick={handleLinkupStatusClick}
                background={statusColor.background}
                color={statusColor.color}
              >
                {linkupRequestStatus}
              </StatusWrapper>
            )}
          </Nickname>
          <ActivityText>{renderLinkupItemText()}</ActivityText>
        </InfoBox>
      </ChannelInfoContainer>

      {isOperator && (
        <MoreMenu
          showGoToItem
          showGoToRequest
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
