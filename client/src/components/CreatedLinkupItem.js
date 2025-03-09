import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import moment from "moment";
import UserAvatar from "./UserAvatar";
import { IoReceipt } from "react-icons/io5";
import nlp from "compromise";
import { useColorMode } from "@chakra-ui/react";
import EmojiTooltip from "./EmojiTooltip";
import { Tooltip } from "@mui/material";

const compromise = nlp;

// OUTER CONTAINER
const Container = styled("div")({
  display: "flex",
  width: "100%",
  justifyContent: "center",
  padding: "0.25rem 0.5rem", // tighter spacing
});

// MAIN CARD
const CardContainer = styled("div")(({ theme, isHovered, colorMode }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "600px",
  padding: "1rem",
  backgroundColor: colorMode === "dark" ? "#1A1D21" : "#FFFFFF",
  borderRadius: "12px",
  border:
    colorMode === "light"
      ? "1px solid rgba(229, 235, 243, 0.8)"
      : "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: isHovered
    ? colorMode === "light"
      ? "0px 4px 12px rgba(0, 0, 0, 0.12)"
      : "0px 4px 16px rgba(0, 0, 0, 0.5)"
    : colorMode === "light"
    ? "0px 1px 4px rgba(0, 0, 0, 0.05)"
    : "0px 1px 4px rgba(0, 0, 0, 0.2)",
  transition: "all 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

// USER INFO
const UserInfoRow = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

// USER NAME
const UserName = styled("span")(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.95rem",
}));

// ONLINE INDICATOR
const OnlineIndicator = styled("div")(({ isOnline }) => ({
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: isOnline ? "#31A24C" : "#B0B3B8",
  marginLeft: "0.5rem",
}));

// TIMESTAMP
const PostInfo = styled("div")(({ theme, colorMode }) => ({
  fontSize: "0.75rem",
  color: colorMode === "dark" ? "white" : theme.palette.text.secondary,
}));

// MAIN CONTENT TEXT
const PostContent = styled("div")(({ colorMode }) => ({
  marginTop: "0.75rem",
  fontSize: "0.92rem",
  color: colorMode === "dark" ? "#DADDE1" : "#1C1E21",
  lineHeight: "1.5",
  "& p": {
    margin: 0,
    fontWeight: 400,
  },
  "& span": {
    fontWeight: 500,
  },
}));

// LOCATION TEXT
const LocationText = styled("div")(({ colorMode }) => ({
  marginTop: "0.5rem",
  fontSize: "0.85rem",
  color: colorMode === "dark" ? "#A8ABB1" : "#606770",
}));

// PAYMENT ICON CONTAINER
const PaymentOptionIcon = styled("div")({
  display: "flex",
  alignItems: "center",
  marginTop: "0.75rem",
  "& svg": {
    fontSize: "1.25rem",
  },
});

const formatDate = (date) => moment(date).format("dddd, MMM D YYYY • h:mm A");

const capitalizeLocation = (location) =>
  location
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const CreatedLinkupItem = ({ linkupItem }) => {
  const { colorMode } = useColorMode();
  const [isHovered, setIsHovered] = useState(false);
  const loggedUser = useSelector((state) => state.loggedUser);

  const {
    id,
    creator_id,
    creator_name,
    activity,
    created_at,
    date,
    avatar,
    location,
  } = linkupItem;

  const renderPaymentOptionIcon = () => {
    switch (linkupItem.payment_option) {
      case "split":
        return (
          <Tooltip title="Let's split the bill!">
            <PaymentOptionIcon>
              <IoReceipt />
              <IoReceipt />
            </PaymentOptionIcon>
          </Tooltip>
        );
      case "iWillPay":
        return (
          <Tooltip title="I'll pay!">
            <PaymentOptionIcon>
              <IoReceipt />
            </PaymentOptionIcon>
          </Tooltip>
        );
      case "pleasePay":
        return (
          <PaymentOptionIcon>
            <EmojiTooltip />
          </PaymentOptionIcon>
        );
      default:
        return null;
    }
  };

  const renderLinkupItemText = () => {
    const doc = compromise(activity);
    const startsWithVerb = doc.verbs().length > 0;
    const isVerbEndingWithIng = activity.endsWith("ing");
    const activityFormatted = activity
      ? isVerbEndingWithIng
        ? `for ${activity}`
        : `${startsWithVerb ? "to" : "for"} ${activity}`
      : "";

    return (
      <p>
        <Link
          to={`/profile/${creator_id}`}
          style={{ fontWeight: 500, textDecoration: "none", color: "inherit" }}
        >
          {creator_name}
        </Link>{" "}
        is trying to link up <span>{activityFormatted}</span> on{" "}
        <span>{formatDate(date)}</span>.
      </p>
    );
  };

  const getTimeAgo = (createdAt) => {
    const now = moment();
    const created = moment(createdAt);
    const duration = moment.duration(now.diff(created));
    const days = duration.asDays();

    if (days < 1) {
      const hours = duration.asHours();
      const minutes = duration.asMinutes();
      if (hours >= 1)
        return `${Math.floor(hours)} hour${
          Math.floor(hours) !== 1 ? "s" : ""
        } ago`;
      if (minutes >= 1)
        return `${Math.floor(minutes)} minute${
          Math.floor(minutes) !== 1 ? "s" : ""
        } ago`;
      return "Just now";
    }
    if (days < 2) return "Yesterday";
    return `${Math.floor(days)} days ago`;
  };

  return (
    <Container>
      <CardContainer
        isHovered={isHovered}
        colorMode={colorMode}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <UserInfoRow>
          <div style={{ display: "flex", alignItems: "center" }}>
            <UserName>{creator_name}</UserName>
            <Tooltip title={linkupItem.is_online ? "Online" : "Offline"} arrow>
              <OnlineIndicator isOnline={linkupItem.is_online} />
            </Tooltip>
          </div>
          <UserAvatar
            userData={{ id: creator_id, name: creator_name, avatar: avatar }}
            width="50px"
            height="50px"
          />
        </UserInfoRow>
        <PostInfo colorMode={colorMode}>{getTimeAgo(created_at)}</PostInfo>

        <PostContent colorMode={colorMode}>
          {renderLinkupItemText()}
        </PostContent>

        <LocationText colorMode={colorMode}>
          {capitalizeLocation(location)}
        </LocationText>

        {renderPaymentOptionIcon()}
      </CardContainer>
    </Container>
  );
};

export default CreatedLinkupItem;
