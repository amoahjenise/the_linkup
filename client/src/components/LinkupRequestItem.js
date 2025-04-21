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
  CancelOutlined,
  QueryBuilderOutlined,
} from "@mui/icons-material";
import moment from "moment";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useColorMode } from "@chakra-ui/react";
import nlp from "compromise";

const compromise = nlp;

const LinkupRequestItemContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "8px", // Soft rounded corners for a modern look
  border: `1px solid ${
    colorMode === "light"
      ? "rgba(229, 235, 243, 1)"
      : "rgba(255, 255, 255, 0.1)"
  }`,
  padding: "1rem",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
  transition: "box-shadow 0.2s ease, transform 0.2s ease", // Smoother and faster transition
  backgroundColor: colorMode === "dark" ? "rgb(16, 16, 16)" : "white",
  "&:hover": {
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)", // Slightly stronger shadow on hover
    transform: "translateY(-2px)", // Small upward lift for interactivity
  },
  "&:active": {
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Slightly reduce shadow on click
    transform: "translateY(0)", // Reset transform on click
  },
  "& + &": {
    marginTop: theme.spacing(1.5), // Add spacing between list items
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  let backgroundColor;
  let color;
  switch (status) {
    case "pending":
      backgroundColor = "rgba(241, 196, 15, 0.1)"; // Yellow with transparency
      color = "#f1c40f";
      break;
    case "accepted":
      backgroundColor = "rgba(115, 255, 174, 0.1)"; // Green with transparency
      color = "#73ffae";
      break;
    case "inactive":
      backgroundColor = "rgba(128, 128, 128, 0.1)"; // Gray with transparency
      color = "#a0a0a0"; // Soft gray
      break;
    default:
      backgroundColor = "rgba(255, 182, 193, 0.1)"; // Pink with transparency
      color = "#ffb6c1";
      break;
  }
  return {
    width: "110px",
    marginRight: "auto",
    backgroundColor: backgroundColor,
    color: color,
    border: `1px solid ${color}`,
    borderRadius: "20px", // Rounded corners for a modern look
    fontWeight: 500,
    fontSize: "0.8rem",
  };
});

const AcceptButton = styled(Button)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "#00BFFF",
  border: `1px solid #00BFFF`,
  borderRadius: "20px", // Rounded corners
  padding: theme.spacing(1, 2),
  cursor: "pointer",
  transition: "background-color 0.2s ease, color 0.2s ease",
  "&:hover": {
    color: "#00BFFF",
    backgroundColor: "rgba(0, 191, 255, 0.1)", // Light blue background on hover
  },
}));

const DeclineButton = styled(Button)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "#FF0000",
  border: `1px solid #FF0000`,
  borderRadius: "20px", // Rounded corners
  padding: theme.spacing(1, 2),
  cursor: "pointer",
  transition: "background-color 0.2s ease, color 0.2s ease",
  "&:hover": {
    color: "#FF0000",
    backgroundColor: "rgba(255, 0, 67, 0.1)", // Light red background on hover
  },
}));

const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  marginTop: theme.spacing(1),
  gap: theme.spacing(1), // Add consistent spacing between buttons
}));

const RequestText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  margin: 0,
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
  marginRight: theme.spacing(1),
  fontSize: "0.875rem",
  fontWeight: 500,
}));

const DetailsText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  fontSize: "0.875rem",
  color: colorMode === "dark" ? "gray" : theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const LinkupRequestItem = ({ post, setShouldFetchLinkups }) => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser?.user?.id || "";
  const [isMyLinkup, setIsMyLinkup] = useState(userId === post.creator_id);
  const { addSnackbar } = useSnackbar();
  const { colorMode } = useColorMode();

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
        return (
          <QueryBuilderOutlined
            fontSize="small"
            color="rgba(241, 196, 15, 0.1)"
          />
        );
      case "accepted":
        return <CheckCircleOutlined fontSize="small" color="#99DFD6" />;
      case "declined":
        return <CloseOutlined fontSize="small" color="#99DFD6" />;
      case "expired":
        return (
          <CancelOutlined CancelOutlined fontSize="small" color="#ffb6c1" />
        );
      case "inactive":
        return <CancelOutlined fontSize="small" style={{ color: "#a0a0a0" }} />;
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
      case "inactive":
        return "inactive";
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
        return `${subject} would like to split the bill for this linkup.`;
      case "pleasePay":
        return `${subject} would like ${
          isMyLinkup ? "the requester" : "you"
        } to pay for this linkup.`;
      case "iWillPay":
        return `${subject} ${
          isMyLinkup ? "are" : "is"
        } willing to pay the bill for this linkup.`;
      default:
        return "";
    }
  };

  useEffect(() => {
    setIsMyLinkup(userId === post.creator_id);
  }, [post.creator_id, userId]);

  return (
    <LinkupRequestItemContainer colorMode={colorMode}>
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
          <RequestText colorMode={colorMode}>
            {renderLinkupItemText()}
          </RequestText>
          <DetailsText colorMode={colorMode}>
            <Typography variant="subtitle2" component="details">
              <Typography variant="subtitle2" component="span" display="block">
                Location: {post.location}
              </Typography>
              <Typography variant="subtitle2" component="span" display="block">
                {getPaymentOptionText()}
              </Typography>
            </Typography>
          </DetailsText>
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
