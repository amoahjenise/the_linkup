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
  marginBottom: theme.spacing(2),
  borderRadius: "12px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.1)",
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  width: "110px",
  borderRadius: "8px",
  fontWeight: "bold",
  backgroundColor:
    status === "pending"
      ? "#f4b400" // MacOS-style yellow
      : status === "accepted"
      ? "#73FFAE" // Soft green for accepted
      : "#FFB6C1", // Light pink for declined
  color: theme.palette.text.primary,
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
}));

const AcceptButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  borderRadius: "8px",
  padding: "6px 12px",
  fontWeight: "500",
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DeclineButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  borderColor: theme.palette.error.main,
  borderRadius: "8px",
  padding: "6px 12px",
  fontWeight: "500",
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  "& > *": {
    marginRight: theme.spacing(1),
  },
}));

const RequestText = styled(Typography)(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
  fontSize: "14px",
  fontWeight: "400",
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
      addSnackbar("Linkup request accepted.");
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
      addSnackbar("Linkup request declined.");
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

  const getPaymentOptionText = () => {
    const subject = isMyLinkup ? "You" : post.creator_name;
    switch (post.payment_option) {
      case "split":
        return `${subject} would like to split the bill for this activity.`;
      case "pleasePay":
        return `${subject} would like ${
          isMyLinkup ? "the requester" : "you"
        } to pay for this activity.`;
      case "iWillPay":
        return `${subject} ${
          isMyLinkup ? "are" : "is"
        } willing to pay the bill for this activity.`;
      default:
        return "";
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
          {/* {isMyLinkup ||
            (post.status === "accepted" && ( */}
          <Typography variant="subtitle2" component="details">
            <Typography variant="subtitle2" component="span" display="block">
              Location: {post.location}
            </Typography>
            <Typography variant="subtitle2" component="span" display="block">
              {getPaymentOptionText()}
            </Typography>
          </Typography>
          {/* ))} */}
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
