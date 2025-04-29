import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import UserAvatar from "./UserAvatar";
import { Typography, Chip } from "@mui/material";
import {
  CheckCircleOutlined,
  QueryBuilderOutlined,
  CancelOutlined,
} from "@mui/icons-material";
import moment from "moment";
import MoreMenu from "./MoreMenu";
import { useColorMode } from "@chakra-ui/react";
import nlp from "compromise";
const compromise = nlp;

// Styled components
const LinkupHistoryItemWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
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

const ItemHeader = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const LinkupDetails = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const ActivityText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: colorMode === "dark" ? "white" : theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
}));

const StyledChip = styled(Chip)(({ theme, status }) => {
  let backgroundColor;
  let color;
  switch (status) {
    case "active":
      backgroundColor = "rgba(15, 241, 90, 0.1)"; // Green with transparency
      color = "#73faae";
      break;
    case "closed":
      backgroundColor = "rgba(240, 247, 248, 0.1)"; // Lightblue-gray with transparency
      color = "#99DFD6";
      break;
    case "completed":
      backgroundColor = "rgba(115, 255, 174, 0.1)"; // Green with transparency
      color = "#73ffae";
      break;
    case "expired":
      backgroundColor = "rgba(255, 182, 193, 0.1)"; // Pink with transparency
      color = "#ffb6c1";
      break;
    default:
      backgroundColor = theme.palette.background.default;
      color = theme.palette.text.secondary;
      break;
  }
  return {
    width: "120px",
    backgroundColor: backgroundColor,
    color: color,
    border: `1px solid ${color}`,
    borderRadius: "20px",
    fontWeight: 500,
    fontSize: "0.8rem",
  };
});

const DetailsText = styled(Typography)(({ theme, colorMode }) => ({
  fontSize: "0.8rem",
  color: colorMode === "dark" ? "gray" : theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const LinkupHistoryItem = ({ linkup, setShouldFetchLinkups }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const { colorMode } = useColorMode();
  const {
    creator_id,
    creator_name,
    avatar,
    gender_preference,
    activity,
    location,
    date,
    status,
    payment_option,
  } = linkup;

  const formattedLocation = location
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const getStatusLabel = () => {
    switch (status) {
      case "active":
        return "Active";
      case "closed":
        return "Closed";
      case "completed":
        return "Completed";
      case "expired":
        return "Expired";
      default:
        return "";
    }
  };

  const renderStatusIcon = () => {
    switch (status) {
      case "active":
        return (
          <QueryBuilderOutlined
            fontSize="small"
            color="rgba(15, 241, 90, 0.1)"
          />
        );
      case "closed":
        return <CheckCircleOutlined fontSize="small" color="#99DFD6" />;
      case "completed":
        return <CheckCircleOutlined fontSize="small" color="#73ffae" />;
      case "expired":
        return <CancelOutlined fontSize="small" color="#ffb6c1" />;
      default:
        return null;
    }
  };

  const getPaymentOptionText = () => {
    switch (payment_option) {
      case "split":
        return `You would like to split the bill for this linkup.`;
      case "pleasePay":
        return `You would like the requester to pay for this linkup.`;
      case "iWillPay":
        return `You are willing to pay the bill for this linkup.`;
      default:
        return "";
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

    const dateText = date ? moment(date).format("MMM DD, YYYY") : "";
    const timeText = date ? `(${moment(date).format("h:mm A")})` : "";

    if (
      status === "active" ||
      status === "closed" ||
      status === "completed" ||
      status === "expired"
    ) {
      return `You are trying to link up ${activityText.toLowerCase()} on ${dateText} ${timeText}.`;
    } else if (status === "expired") {
      return `Link up ${activityText.toLowerCase()} on ${dateText} ${timeText} has expired.`;
    } else {
      return "";
    }
  };

  return (
    <LinkupHistoryItemWrapper colorMode={colorMode}>
      <ItemHeader>
        <UserAvatar
          userData={{
            id: creator_id,
            name: creator_name,
            avatar: avatar,
          }}
          width="40px"
          height="40px"
        />
        {status === "active" && (
          <MoreMenu
            showGoToItem={false}
            showEditItem={true}
            showDeleteItem={true}
            showCloseItem={true}
            showCheckInLinkup={false}
            showAcceptLinkupRequest={false}
            linkupItem={linkup}
            addLinkup={() => {}}
            updateLinkup={() => {}}
            removeLinkup={() => {}}
            menuAnchor={menuAnchor}
            setMenuAnchor={setMenuAnchor}
            scrollToTop={() => {}}
          />
        )}
      </ItemHeader>
      <LinkupDetails>
        <ActivityText colorMode={colorMode}>
          {renderLinkupItemText()}
        </ActivityText>
        <StyledChip
          label={getStatusLabel()}
          icon={renderStatusIcon()}
          status={status} // Pass the status for conditional styling
        />
      </LinkupDetails>
      <DetailsText colorMode={colorMode}>
        <Typography variant="subtitle2" component="details">
          <Typography variant="subtitle2" component="span" display="block">
            Location: {formattedLocation}
          </Typography>
          <Typography variant="subtitle2" component="span" display="block">
            {getPaymentOptionText()}
          </Typography>
        </Typography>
      </DetailsText>
    </LinkupHistoryItemWrapper>
  );
};

export default LinkupHistoryItem;
