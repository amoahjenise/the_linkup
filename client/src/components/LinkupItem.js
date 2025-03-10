import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import moment from "moment";
import UserAvatar from "./UserAvatar";
import MoreMenu from "./MoreMenu";
import PostActions from "./PostActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import { getLinkupStatus } from "../api/linkUpAPI";
import { IoReceipt } from "react-icons/io5";
import nlp from "compromise";
import { useColorMode } from "@chakra-ui/react"; // Import useColorMode from Chakra UI
import EmojiTooltip from "./EmojiTooltip";
import { Tooltip } from "@mui/material";
import { CircularProgress } from "@mui/material";

const compromise = nlp;

// Container wrapper
const Container = styled("div")(({ theme }) => ({
  padding: "0.4rem 0.8rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  backgroundColor: "transparent",
}));

// Card-like container with refined hover effects
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
  backgroundColor: colorMode === "dark" ? "rgb(10, 70, 87, 0.2)" : "#FFFFFF",
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
const UserInfo = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

// Post action buttons container
const PostActionsContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  marginTop: "0.5rem",
});

// Distance and meta information
const DistanceInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: "#718096",
  marginTop: "0.25rem",
  marginLeft: "4px",
  fontSize: "0.8rem",
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem",
  },
}));

const PostContent = styled("div")(({ colorMode, theme }) => ({
  // Add 'theme' here
  marginTop: "1rem",
  lineHeight: "1.5rem",
  fontSize: "0.9rem",
  fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  color: colorMode === "light" ? "#1C1E21" : "#E4E6EB",

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

  // ADD THIS MEDIA QUERY:
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
    fontSize: "0.7rem", // Smaller font size for mobile
  },
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

const formatDate = (date) => moment(date).format("dddd, MMM D YYYY • h:mm A");

const capitalizeLocation = (location) =>
  location
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const LinkupItem = ({ linkupItem, setShouldFetchLinkups, disableRequest }) => {
  const { colorMode } = useColorMode(); // Use useColorMode hook
  const navigate = useNavigate();
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
    latitude,
    longitude,
    location,
  } = linkupItem;
  const [menuAnchor, setMenuAnchor] = useState(null);
  const { addSnackbar } = useSnackbar();

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) *
        Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  };

  const degreesToRadians = (degrees) => degrees * (Math.PI / 180);
  // Ensure the logged user has valid latitude/longitude values
  const useDistance = (latitude, longitude) => {
    const [distance, setDistance] = useState(null);

    useEffect(() => {
      if (loggedUser?.user?.latitude && loggedUser?.user?.longitude) {
        const userLat = loggedUser.user.latitude;
        const userLon = loggedUser.user.longitude;

        if (latitude && longitude) {
          const dist = calculateDistance(userLat, userLon, latitude, longitude);
          setDistance(dist.toFixed(0)); // Set distance with 0 decimal places
        } else {
          setDistance(null); // Handle cases where distance can't be calculated
        }
      }
    }, [latitude, longitude]);

    return distance;
  };

  const distanceInKm = useDistance(latitude, longitude); // Use the distance hook

  const renderPaymentOptionIcon = () => {
    switch (linkupItem.payment_option) {
      case "split":
        return (
          <Tooltip title="Lets split the bill!">
            <span
              role="img"
              aria-label="split the bill"
              style={{
                fontSize: "30px",
                fontFamily:
                  "'Segoe UI Emoji', 'Apple Color Emoji', 'Segoe UI', 'Roboto', sans-serif",
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
            </span>{" "}
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

  const handleRequestLinkup = async () => {
    const response = await getLinkupStatus(id);
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
          : `/send-request/${id}`;
        navigate(destination);
        return;
    }

    if (!disableRequest) {
      setShouldFetchLinkups(true);
      addSnackbar(message, { timeout: 7000 });
    }
  };

  const renderLinkupItemText = () => {
    // Parse the activity using NLP
    const doc = compromise(activity);

    // Detect verbs and nouns
    const verbs = doc.verbs();
    const nouns = doc.nouns();

    // Check if any of the nouns are plural
    const isPlural = nouns.some((noun) => noun.tag() === "Plural");

    // Default activity formatted string
    let activityFormatted = "";

    // If it's a gerund (e.g., "Hiking", "Running"), treat it as a noun phrase
    const isGerund = activity.match(/\w+ing$/);

    if (isGerund) {
      activityFormatted = `for ${activity}`;
    } else {
      // If it's plural or contains more nouns, use "for" (e.g., "hikes", "soccer games")
      const isNounHeavy = nouns.length >= verbs.length || isPlural;
      activityFormatted = isNounHeavy ? `for ${activity}` : `to ${activity}`;
    }

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

      if (hours >= 1) {
        return `${Math.floor(hours)} hour${
          Math.floor(hours) !== 1 ? "s" : ""
        } ago`;
      } else if (minutes >= 1) {
        return `${Math.floor(minutes)} minute${
          Math.floor(minutes) !== 1 ? "s" : ""
        } ago`;
      } else {
        return "Just now";
      }
    } else if (days < 2) {
      return "Yesterday";
    } else {
      return `${Math.floor(days)} days ago`;
    }
  };

  return (
    <div
    // style={{
    //   paddingLeft: "24px",
    //   paddingRight: "24px",
    // }}
    >
      <Container>
        <CardContainer
          isHovered={isHovered}
          colorMode={colorMode}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={{ display: "flex", width: "100%" }}>
            {/* Left Side */}
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
                {/* <div>{formatDate(date)}</div> */}
                {renderLinkupItemText()}
                <div>Location: {capitalizeLocation(location)}</div>
              </PostContent>
              <PostActionsContainer>
                {loggedUser.user.id !== linkupItem.creator_id && (
                  <div>
                    <div>
                      <PostActions
                        paymentOption={linkupItem.payment_option}
                        onRequestClick={handleRequestLinkup}
                        disableRequest={disableRequest}
                      />
                    </div>
                  </div>
                )}
                <span>{renderPaymentOptionIcon()}</span>
              </PostActionsContainer>
            </div>

            {/* Right Side */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <MoreMenuContainer>
                {loggedUser.user.id === linkupItem.creator_id ? (
                  <MoreMenu
                    showGoToItem={true}
                    showEditItem={true}
                    showDeleteItem={true}
                    showCloseItem={true}
                    showCheckInLinkup={false}
                    showAcceptLinkupRequest={false}
                    linkupItem={linkupItem}
                    setShouldFetchLinkups={setShouldFetchLinkups}
                    menuAnchor={menuAnchor}
                    setMenuAnchor={setMenuAnchor}
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
    </div>
  );
};

export default LinkupItem;
