import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  acceptLinkupRequest,
  declineLinkupRequest,
} from "../api/linkupRequestAPI";
import UserAvatar from "./UserAvatar";
import { Chip, Button, Typography } from "@mui/material";
import {
  CheckCircleOutlined,
  CloseOutlined,
  QueryBuilderOutlined,
} from "@mui/icons-material";
import moment from "moment";
import { useSnackbar } from "../contexts/SnackbarContext";
import nlp from "compromise";

const compromise = nlp;

const LinkupRequestItemContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderBottom: "1px solid #D3D3D3",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  width: "110px",
  marginRight: "auto",
  backgroundColor:
    status === "pending"
      ? "#f1c40f"
      : status === "accepted"
      ? "rgb(115, 255, 174, 0.9)"
      : "pink",
  color: theme.palette.text.secondary,
}));

const AcceptButton = styled(Button)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "#00BFFF",
  borderColor: "#00BFFF",
  borderWidth: "1px",
  border: "0.1px solid #ccc",
  marginRight: theme.spacing(2),
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  "&:hover": {
    color: "#00BFFF",
    backgroundColor: "rgb(0, 191, 255, 0.1)",
  },
}));

const DeclineButton = styled(Button)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "#FF0000",
  borderColor: "#FF0000",
  borderWidth: "1px",
  border: "0.1px solid #ccc",
  marginRight: theme.spacing(2),
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  "&:hover": {
    color: "#FF0000",
    backgroundColor: "rgb(255, 0, 67, 0.2)",
  },
}));

const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  marginTop: theme.spacing(1),
  "& > *": {
    marginRight: theme.spacing(1),
  },
}));

const RequestText = styled("p")(({ theme }) => ({
  margin: 0,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

const LinkupRequestItem = ({ post, setShouldFetchLinkups }) => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id || "";
  const [isMyLinkup, setIsMyLinkup] = useState(userId === post.creator_id);
  const { addSnackbar } = useSnackbar();

  const handleAcceptClick = async () => {
    try {
      await acceptLinkupRequest(post.id);
      dispatch({
        type: "UPDATE_REQUEST_STATUS",
        payload: { id: post.id, status: "accepted" },
      });
      setShouldFetchLinkups(true);
      addSnackbar("Link-up request accepted.");
    } catch (error) {
      addSnackbar(error.message);
    }
  };

  const handleDeclineClick = async () => {
    try {
      await declineLinkupRequest(post.id);
      dispatch({
        type: "UPDATE_REQUEST_STATUS",
        payload: { id: post.id, status: "declined" },
      });
      setShouldFetchLinkups(true);
      addSnackbar("Link-up request declined.");
    } catch (error) {
      addSnackbar(error.message);
    }
  };

  const renderStatusIcon = () => {
    switch (post.status) {
      case "pending":
        return <QueryBuilderOutlined />;
      case "accepted":
        return <CheckCircleOutlined />;
      case "declined":
        return <CloseOutlined />;
      case "expired":
        return <CloseOutlined />;
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    switch (post.status) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "declined":
        return "Declined";
      case "expired":
        return "Expired";
      default:
        return null;
    }
  };

  const renderLinkupItemText = () => {
    const doc = compromise(post.activity);
    const startsWithVerb = doc.verbs().length > 0;
    const isVerbEndingWithIng = post.activity.endsWith("ing");

    let activityText = "";
    if (post.activity) {
      if (isVerbEndingWithIng) {
        activityText = `for ${post.activity}`;
      } else {
        activityText = `${startsWithVerb ? "to" : "for"} ${post.activity}`;
      }
    }

    const dateText = post.link_up_date
      ? `${moment(post.link_up_date).format("MMM DD, YYYY")} (${moment(
          post.link_up_date
        ).format("h:mm A")})`
      : "";

    if (userId === post.receiver_id) {
      return `You received a request from ${post.requester_name} ${activityText} scheduled for ${dateText}`;
    } else {
      return `Request sent to ${post.creator_name} ${activityText} scheduled for ${dateText}`;
    }
  };

  useEffect(() => {
    setIsMyLinkup(userId === post.creator_id);
  }, [post.creator_id, userId]);

  return (
    <LinkupRequestItemContainer>
      <div>
        <UserAvatar
          userData={{
            id: isMyLinkup ? post.requester_id : post.creator_id,
            name: isMyLinkup ? post.requester_name : post.creator_name,
            avatar: isMyLinkup ? post.receiver_avatar : post.avatar,
          }}
          width="40px"
          height="40px"
        />
        <div>
          <RequestText>{renderLinkupItemText()}</RequestText>
          {isMyLinkup ||
            (post.status === "accepted" && (
              <Typography variant="subtitle2" component="details">
                <span>{post.location}</span>
              </Typography>
            ))}
        </div>
      </div>
      <div>
        {userId === post.receiver_id ? (
          <div>
            {post.status === "pending" ? (
              <ButtonGroup>
                <AcceptButton
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleAcceptClick}
                >
                  Accept
                </AcceptButton>
                <DeclineButton
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={handleDeclineClick}
                >
                  Decline
                </DeclineButton>
              </ButtonGroup>
            ) : (
              <StatusChip
                label={getStatusLabel()}
                icon={renderStatusIcon()}
                variant="outlined"
                status={post.status}
              />
            )}
          </div>
        ) : (
          <StatusChip
            label={getStatusLabel()}
            icon={renderStatusIcon()}
            variant="outlined"
            status={post.status}
          />
        )}
      </div>
    </LinkupRequestItemContainer>
  );
};

export default LinkupRequestItem;
