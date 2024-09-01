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
import HorizontalMenu from "./HorizontalMenu";
import nlp from "compromise";
const compromise = nlp;

// Styled components
const LinkupHistoryItemWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderBottom: "1px solid #D3D3D3",
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
  marginRight: theme.spacing(4),
}));

const StyledChip = styled(Chip)(({ theme, status }) => {
  let backgroundColor;
  switch (status) {
    case "active":
      backgroundColor = "#f1c40f"; // Yellow
      break;
    case "closed":
      backgroundColor = "#F0F7F8"; // Lightblue-gray
      break;
    case "completed":
      backgroundColor = "rgb(115, 255, 174, 0.9)"; // Green
      break;
    case "expired":
      backgroundColor = "pink"; // Pink
      break;
    default:
      backgroundColor = "#FFFFFF";
      break;
  }
  return {
    width: "140px",
    marginLeft: "auto",
    backgroundColor: backgroundColor,
    color: theme.palette.text.secondary,
  };
});

const LinkupHistoryItem = ({ linkup, setShouldFetchLinkups }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);

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
        return <QueryBuilderOutlined />;
      case "closed":
        return <CheckCircleOutlined />;
      case "completed":
        return <CheckCircleOutlined />;
      case "expired":
        return <CancelOutlined />;
      default:
        return null;
    }
  };

  const getPaymentOptionText = () => {
    switch (payment_option) {
      case "split":
        return `You would like to split the bill for this activity.`;
      case "pleasePay":
        return `You would like the requester to pay for this activity.`;
      case "iWillPay":
        return `You are willing to pay the bill for this activity.`;
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
      return `You are trying to link up ${activityText.toLowerCase()} on ${dateText} ${timeText} with a gender preference for ${gender_preference}.`;
    } else if (status === "expired") {
      return `Link up ${activityText.toLowerCase()} on ${dateText} ${timeText} has expired.`;
    } else {
      return "";
    }
  };

  return (
    <LinkupHistoryItemWrapper>
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
          <HorizontalMenu
            showGoToItem={false}
            showEditItem={true}
            showDeleteItem={true}
            showCloseItem={true}
            showCheckInLinkup={false}
            showAcceptLinkupRequest={false}
            linkupItem={linkup}
            setShouldFetchLinkups={setShouldFetchLinkups}
            menuAnchor={menuAnchor}
            setMenuAnchor={setMenuAnchor}
          />
        )}
      </ItemHeader>
      <LinkupDetails>
        <div>
          <p>{renderLinkupItemText()}</p>
        </div>
        <StyledChip
          label={getStatusLabel()}
          icon={renderStatusIcon()}
          variant="outlined"
          status={status} // Pass the status for conditional styling
        />
      </LinkupDetails>
      <Typography variant="subtitle2" component="details">
        <Typography variant="subtitle2" component="span" display="block">
          Location: {formattedLocation}
        </Typography>
        <Typography variant="subtitle2" component="span" display="block">
          {getPaymentOptionText()}
        </Typography>
      </Typography>
    </LinkupHistoryItemWrapper>
  );
};

export default LinkupHistoryItem;
