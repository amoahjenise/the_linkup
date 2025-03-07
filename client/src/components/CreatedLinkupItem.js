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

const Container = styled("div")({
  padding: "0.75rem 1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  backgroundColor: "transparent",
});

const CardContainer = styled("div")(({ theme, isHovered, colorMode }) => ({
  border: `1px solid ${
    colorMode === "light"
      ? "rgba(229, 235, 243, 1)"
      : "rgba(255, 255, 255, 0.1)"
  }`,
  padding: "1rem",
  borderRadius: "1rem",
  width: "100%",
  minHeight: "175px",
  backgroundColor: colorMode === "dark" ? "#19262e" : "#FFFFFF",
  backdropFilter: "blur(12px)",
  boxShadow:
    colorMode === "light"
      ? isHovered
        ? "0 4px 12px rgba(0, 0, 0, 0.15)"
        : "0 2px 6px rgba(0, 0, 0, 0.05)"
      : isHovered
      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
      : "none",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow:
      colorMode === "light"
        ? "0 6px 18px rgba(0, 0, 0, 0.1)"
        : "0 6px 18px rgba(255, 255, 255, 0.15)",
  },
  cursor: "pointer",
}));

const UserName = styled("div")({
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "inherit",
});

const Name = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

const UserInfo = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

const PostActionsContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  marginTop: "0.5rem",
});

const PostContent = styled("div")(({ colorMode }) => ({
  marginTop: "0.5rem",
  lineHeight: "1.5rem",
  fontSize: "0.935rem",
  color: colorMode === "light" ? "#1C1E21" : "#E4E6EB",
  "& div:first-of-type": {
    fontWeight: "500",
    color: colorMode === "light" ? "#242526" : "#DADDE1",
    marginBottom: "6px",
  },
  "& p": {
    fontWeight: "400",
    color: colorMode === "light" ? "#3D3D3D" : "#C9CCD1",
    letterSpacing: "0.2px",
  },
  "& div:last-of-type": {
    marginTop: "6px",
    fontWeight: "500",
    fontSize: "0.9rem",
    color: colorMode === "light" ? "#606770" : "#A8ABB1",
  },
}));

const PostInfo = styled("div")({
  display: "flex",
  alignItems: "center",
  fontSize: "0.8rem",
  color: "#718096",
});

const OnlineIndicator = styled("div")(({ isOnline }) => ({
  width: "0.5rem",
  height: "0.5rem",
  borderRadius: "50%",
  backgroundColor: isOnline ? "#31A24C" : "#B0B3B8",
  marginLeft: "0.5rem",
}));

const PaymentOptionIcon = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "50%",
  height: "50%",
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
          <Tooltip title="Lets split the bill!">
            <span
              role="img"
              aria-label="split the bill"
              style={{ fontSize: "30px" }}
            >
              <PaymentOptionIcon>
                <IoReceipt />
                <IoReceipt />
              </PaymentOptionIcon>
            </span>
          </Tooltip>
        );
      case "iWillPay":
        return (
          <Tooltip title="I'll pay!">
            <span role="img" aria-label="i'll pay" style={{ fontSize: "30px" }}>
              <PaymentOptionIcon>
                <IoReceipt />
              </PaymentOptionIcon>
            </span>
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
          style={{ fontWeight: 500 }}
          to={`/profile/${creator_id}`}
          className={UserName}
        >
          {creator_name}
        </Link>{" "}
        is trying to link up{" "}
        <span style={{ fontWeight: 500 }}>{activityFormatted}</span> on{" "}
        <span style={{ fontWeight: 500 }}>{formatDate(date)}</span>.
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
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ flex: 2, marginRight: "1rem" }}>
            <UserInfo>
              <Name>
                <UserName>{creator_name}</UserName>
                <Tooltip
                  title={linkupItem.is_online ? "Online" : "Offline"}
                  arrow
                >
                  <OnlineIndicator isOnline={linkupItem.is_online} />
                </Tooltip>
              </Name>
            </UserInfo>
            <PostInfo>
              <span>{getTimeAgo(created_at)}</span>
            </PostInfo>
            <PostContent colorMode={colorMode}>
              {renderLinkupItemText()}
              <div>{capitalizeLocation(location)}</div>
            </PostContent>
            <PostActionsContainer>
              <span>{renderPaymentOptionIcon()}</span>
            </PostActionsContainer>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <UserAvatar
              userData={{ id: creator_id, name: creator_name, avatar: avatar }}
              width="80px"
              height="80px"
            />
          </div>
        </div>
      </CardContainer>
    </Container>
  );
};

export default CreatedLinkupItem;
