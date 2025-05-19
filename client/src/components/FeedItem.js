import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useFeedItemUtils from "../hooks/useFeedItemUtils"; // Adjust the path accordingly
import { styled } from "@mui/material/styles";
import { useColorMode } from "@chakra-ui/react";
import UserAvatar from "./UserAvatar"; // Placeholder
import MoreMenu from "./MoreMenu"; // Placeholder
import PostActions from "./PostActions"; // Placeholder
import { CircularProgress } from "@mui/material";
import EmojiTooltip from "./EmojiTooltip";
import { Tooltip } from "@mui/material";
import { IoReceipt } from "react-icons/io5";
import { useSnackbar } from "../contexts/SnackbarContext";
import { getLinkupStatus } from "../api/linkUpAPI";

// Container wrapper
const Container = styled("div")(({ theme }) => ({
  padding: "0.4rem 0.8rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  backgroundColor: "transparent",
  [theme.breakpoints.down("sm")]: {
    alignItems: "flex-start",
    padding: "0.4rem 0.6rem",
  },
}));

// Card-like container with refined hover effects
const CardContainer = styled("div")(({ theme, colorMode }) => ({
  // Base styles (mobile-first)
  width: "100%",
  minHeight: "175px",
  padding: "1rem",
  borderRadius: "1rem",

  // Color and effects
  backgroundColor:
    colorMode === "dark" ? "hsl(210, 100.00%, 50.00%)" : "#FFFFFF",
  border:
    colorMode === "dark"
      ? "1px solid hsl(210, 18%, 20%)" // Muted, deep blue for subtle sophistication
      : "1px solid #e5e7eb", // Light border for contrast in light mode
  boxShadow:
    colorMode === "dark"
      ? "0 4px 20px hsla(210, 100%, 50%, 0.12)" // Soft shadow with a hint of blue for professionalism
      : "0 2px 8px rgba(0, 0, 0, 0.08)", // Lighter shadow in light mode
  backdropFilter: colorMode === "dark" ? "blur(12px)" : "none",
  backgroundImage:
    colorMode === "dark"
      ? "linear-gradient(to bottom, hsla(210, 18%, 13%, 0.9), hsla(210, 20%, 15%, 0.95))"
      : "none",

  // Responsive widths for smaller screens

  [theme.breakpoints.down("sm")]: {
    padding: "1rem 1.25rem",
    borderRadius: "0.75rem",
  },

  // Responsive widths for larger screens
  [theme.breakpoints.up("md")]: {
    width: "100%",
  },
  [theme.breakpoints.up("lg")]: {
    width: "100%",
  },
  [theme.breakpoints.up("xl")]: {
    width: "100%",
  },
  [theme.breakpoints.up(1800)]: {
    width: "60%",
  },

  // Hover effects
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow:
      colorMode === "light"
        ? "0 6px 18px rgba(0, 0, 0, 0.1)"
        : "0 6px 18px rgba(255, 255, 255, 0.15)", // Lighter hover effect
  },
  cursor: "pointer",

  // Additional highlights for engaging interactions
  "& .cta-button": {
    backgroundColor:
      colorMode === "dark" ? "hsl(340, 70%, 50%)" : "hsl(45, 100%, 50%)", // Red for urgency in dark, yellow for energy in light mode
    color: "#FFFFFF",
    borderRadius: "0.5rem",
    padding: "0.8rem 1.5rem",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor:
        colorMode === "dark" ? "hsl(340, 70%, 55%)" : "hsl(45, 100%, 60%)", // Slightly lighter for hover
    },
  },
}));

// Menu container for additional options
const MoreMenuContainer = styled("div")({
  marginLeft: "auto",
});

// Username styling with a modern touch
const UserName = styled("div")({
  fontSize: "0.9rem",
  fontWeight: "600",
  color: "inherit",
});

// User name and online status container
const Name = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

// User info container
const UserInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  flexWrap: "wrap",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.3rem",
  },
}));

const PostActionsContainer = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  marginTop: "0.5rem",
}));

// Distance and meta information
const DistanceInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: "#718096",
  marginBottom: "1rem",
  // marginLeft: "2rem",
  fontSize: "0.8rem",
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
    flexDirection: "column", // stack meta info
    alignItems: "flex-start",
    gap: "0.25rem",
  },
}));

// Post content component with word wrapping
const PostContent = styled("div")(({ colorMode, theme }) => ({
  marginTop: "1rem",
  lineHeight: "1.5rem",
  fontSize: "0.9rem",
  fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  color: colorMode === "light" ? "#1C1E21" : "#E4E6EB",
  wordWrap: "break-word", // Added word wrapping

  "& div:first-of-type": {
    fontWeight: "600",
    color: colorMode === "light" ? "#242526" : "#DADDE1",
    marginBottom: "10px",
  },

  "& p": {
    fontWeight: "400",
    marginBottom: "8px",
  },

  "& div:last-of-type": {
    marginTop: "2px",
    fontWeight: "500",
    fontSize: "0.85rem",
    color: colorMode === "light" ? "#606770" : "#D1D4D9",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem", // Smaller font size for mobile
    "& div:last-of-type": {
      fontSize: "0.8rem", // Smaller meta font on mobile
    },
  },
}));

// Post metadata (timestamp, location, etc.)
const PostInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontSize: "0.8rem",
  color: "#718096",
  gap: "12px",
  fontWeight: "400",
  textTransform: "capitalize",

  // MODIFY THIS MEDIA QUERY:
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
    flexDirection: "column", // stack meta info
    alignItems: "flex-start",
    gap: "0.25rem",
  },
}));

// Adjusting the left side container
const LeftSide = styled("div")(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  marginRight: "1rem",
  display: "flex",
  flexDirection: "column",
  overflowWrap: "break-word", // Ensures no overflow
  width: "100%", // Ensure it takes the full available space
}));

// Online status indicator
const OnlineIndicator = styled("div")(({ isOnline }) => ({
  width: "0.5rem",
  height: "0.5rem",
  borderRadius: "50%",
  backgroundColor: isOnline ? "#31A24C" : "#B0B3B8",
  marginLeft: "0.5rem",
}));

// Payment option icon container
const PaymentOptionIcon = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "50%",
  height: "50%",
});

const PaymentOptionIconContainer = styled("div")({
  display: "inline-block",
});

const FeedItem = ({
  linkup,
  addLinkup,
  updateLinkup,
  removeLinkup,
  handleScrollToTop,
  loggedUser,
  sentRequests,
}) => {
  const { colorMode } = useColorMode();

  const [menuAnchor, setMenuAnchor] = useState(null);

  const navigate = useNavigate();

  const { addSnackbar } = useSnackbar();

  const {
    id,
    created_at,
    creator_id,
    creator_name,
    activity,
    date,
    avatar,
    location,
    latitude,
    longitude,
  } = linkup;

  const {
    getTimeAgo,
    capitalizeLocation,
    formatActivityText,
    useDistance,
    formatDate,
  } = useFeedItemUtils();

  const formattedDate = formatDate(date);

  const distanceInKm = useDistance(loggedUser, latitude, longitude); // Use the distance hook

  const disableRequest = sentRequests.has(linkup.id);

  const handleRequestLinkup = async (linkupId) => {
    const response = await getLinkupStatus(linkupId);
    let message = "";

    switch (response.linkupStatus) {
      case "expired":
        message = "This linkup has expired.";
        break;
      case "closed":
        message = "This linkup was closed and can no longer receive requests.";
        break;
      case "inactive":
        message = "This linkup was deleted.";
        break;
      default:
        const destination = disableRequest
          ? `/history/requests-sent`
          : `/send-request/${linkupId}`;
        navigate(destination);
        return;
    }

    if (!disableRequest) {
      addSnackbar(message, { timeout: 7000 });
    }
  };

  const renderPaymentOptionIcon = () => {
    switch (linkup.payment_option) {
      case "split":
        return (
          <Tooltip title="Lets split the bill!">
            <span
              role="img"
              aria-label="split the bill"
              style={{
                fontSize: "30px",
                ...(window.innerWidth < 600 && { fontSize: "24px" }), // mobile size
                fontFamily: "'Segoe UI Emoji', ...",
              }}
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
            <span
              role="img"
              aria-label="i'll pay"
              style={{
                fontSize: "30px",
                fontFamily:
                  "'Segoe UI Emoji', 'Apple Color Emoji', 'Segoe UI', 'Roboto', sans-serif",
              }}
            >
              <PaymentOptionIcon>
                <IoReceipt />
              </PaymentOptionIcon>
            </span>
          </Tooltip>
        );
      case "pleasePay":
        return (
          <PaymentOptionIconContainer>
            <EmojiTooltip />
          </PaymentOptionIconContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <CardContainer colorMode={colorMode}>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexWrap: "wrap", // allow wrapping
            width: "100%",
            justifyContent: "space-between",
            rowGap: "0.5rem", // better spacing for stacked content
          }}
        >
          {/* Left Side */}
          <LeftSide>
            <UserInfo>
              <Name>
                <UserName>
                  <Link to={`/profile/${creator_id}`} className={UserName}>
                    {creator_name}
                  </Link>
                </UserName>
                <Tooltip title={linkup.is_online ? "Online" : "Offline"} arrow>
                  <OnlineIndicator isOnline={linkup.is_online} />
                </Tooltip>
              </Name>
            </UserInfo>
            <PostInfo>
              <span>{getTimeAgo(created_at)}</span>
            </PostInfo>
            <PostContent colorMode={colorMode}>
              {formatActivityText(
                activity,
                creator_name,
                creator_id,
                formattedDate,
                UserName
              )}
              <div>Location: {capitalizeLocation(location)}</div>
            </PostContent>
            <PostActionsContainer>
              {loggedUser.id !== linkup.creator_id && (
                <div>
                  <div>
                    <PostActions
                      paymentOption={linkup.payment_option}
                      onRequestClick={() => handleRequestLinkup(linkup.id)}
                      disableRequest={disableRequest}
                    />
                  </div>
                </div>
              )}
              <span>{renderPaymentOptionIcon()}</span>
            </PostActionsContainer>
          </LeftSide>

          {/* Right Side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <MoreMenuContainer>
              {loggedUser.id === linkup.creator_id ? (
                <MoreMenu
                  showGoToItem={true}
                  showEditItem={true}
                  showDeleteItem={true}
                  showCloseItem={true}
                  showCheckInLinkup={false}
                  showAcceptLinkupRequest={false}
                  linkupItem={linkup}
                  addLinkup={addLinkup}
                  updateLinkup={updateLinkup}
                  removeLinkup={removeLinkup}
                  menuAnchor={menuAnchor}
                  setMenuAnchor={setMenuAnchor}
                  scrollToTop={handleScrollToTop}
                />
              ) : (
                <DistanceInfo>
                  <span>
                    {distanceInKm ? (
                      distanceInKm < 0.5 ? (
                        "< 500m away"
                      ) : distanceInKm < 1 ? (
                        "< 1 km away"
                      ) : (
                        `${distanceInKm} km away`
                      )
                    ) : (
                      <CircularProgress size={24} />
                    )}
                  </span>
                </DistanceInfo>
              )}
            </MoreMenuContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <UserAvatar
                userData={{
                  id: creator_id,
                  name: creator_name,
                  avatar: avatar,
                }}
                width="100px"
                height="100px"
              />
            </div>
          </div>
        </div>
      </CardContainer>
    </Container>
  );
};

export default FeedItem;
