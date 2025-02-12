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

// Styled Components
const Container = styled("div")(({ theme }) => ({
  padding: "0.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  // borderBottom: "1px solid rgba(130, 131, 129, 0.32)",
  paddingTop: "12px",
  paddingLeft: "16px",
  paddingRight: "16px",
}));

const CardContainer = styled("div")(({ theme, isHovered, colorMode }) => ({
  border: `1px solid ${
    colorMode === "light"
      ? "rgba(229, 235, 243, 1)" // Light border for light mode
      : "rgba(255, 255, 255, 0.1)" // Subtle border for dark mode
  }`,
  padding: "1rem",
  borderRadius: "0.75rem", // Slightly rounded corners for clean, balanced look
  width: "100%",
  minHeight: "175px", // Ensures consistency
  backgroundColor: colorMode === "dark" ? "#15202B" : "#FFFFFF",

  backdropFilter: "blur(8px)", // Glass-like background effect

  // Box shadow for light mode
  boxShadow:
    colorMode === "light"
      ? isHovered
        ? "0 12px 24px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)" // More defined shadow on hover
        : "0 4px 8px rgba(0, 0, 0, 0.05)" // Subtle shadow when not hovered
      : isHovered
      ? "0 12px 24px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.2)" // Stronger shadow on hover for dark mode
      : "none", // No shadow by default in dark mode

  transition: "transform 0.2s ease, box-shadow 0.2s ease",

  "&:hover": {
    transform: "translateY(-2px)", // Subtle hover effect
    boxShadow:
      colorMode === "light"
        ? "0 12px 24px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.025)" // Hover shadow for light mode
        : "0 12px 24px rgba(255, 255, 255, 0.075), 0 4px 6px rgba(80, 80, 0, 0.025)", // Hover shadow for dark mode
  },
  cursor: "pointer",
}));

const MoreMenuContainer = styled("div")(({ theme }) => ({
  marginLeft: "auto",
}));

const UserName = styled("div")(({ theme }) => ({
  fontSize: "0.85rem",
  fontWeight: "bold",
}));

const Name = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const UserInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const PostActionsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginTop: "0.5rem",
}));

const DistanceInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: "#718096",
  marginTop: "0.25rem",
  marginLeft: "4px",
  lineHeight: "1rem",
  fontSize: "0.8rem",
  fontFamily:
    '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', // Updated font
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem", // Adjust font size for mobile
  },
}));

const PostContent = styled("div")(({ theme, colorMode }) => ({
  marginTop: "0.5rem",
  lineHeight: "1.25rem",
  fontSize: "0.8rem",
  fontFamily:
    '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', // Updated font

  // Date/Time style
  "& div:first-of-type": {
    fontWeight: "350", // Semi-bold
    color: colorMode === "light" ? "#616871" : "white",
    marginBottom: "4px",
  },

  // Post Text style
  "& p": {
    fontWeight: "450", // Semi-bold
    color: colorMode === "light" ? "#636977" : "white",
  },

  // Location style
  "& div:last-of-type": {
    marginTop: "5px",
    fontWeight: "450", // Semi-bold
    fontSize: "0.8rem", // Smaller font
    color: colorMode === "light" ? "#636977" : "white",
  },
}));

const PostInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontSize: "0.8rem",
  color: "#718096",
}));

const OnlineIndicator = styled("div")(({ isOnline }) => ({
  width: "0.5rem",
  height: "0.5rem",
  borderRadius: "50%",
  backgroundColor: isOnline ? "green" : "gray", // Green if online, gray if offline
  marginLeft: "0.5rem", // Space between username and indicator
}));

const PaymentOptionIcon = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "50%",
  height: "50%",
}));

const PaymentOptionIconContainer = styled("div")(({ theme }) => ({
  display: "inline-block",
}));

const formatDate = (date) => moment(date).format("ddd • MMM D, YYYY • h:mm A");

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
    const doc = compromise(activity);
    const startsWithVerb = doc.verbs().length > 0;
    const isVerbEndingWithIng = activity.endsWith("ing");

    let activityFormatted = "";

    if (activity) {
      if (isVerbEndingWithIng) {
        activityFormatted = `for ${activity}`;
      } else {
        activityFormatted = `${startsWithVerb ? "to" : "for"}  ${activity}`;
      }
    }

    return (
      <p>
        <Link to={`/profile/${creator_id}`} className={UserName}>
          {creator_name}
        </Link>
        {" is trying to link up " + activityFormatted + "."}
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
                  <OnlineIndicator isOnline={linkupItem.is_online} />
                </Name>
              </UserInfo>
              <PostInfo>
                <span>{getTimeAgo(created_at)}</span>
              </PostInfo>
              <PostContent colorMode={colorMode}>
                <div>{formatDate(date)}</div>
                {renderLinkupItemText()}
                <div>{capitalizeLocation(location)}</div>
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
                  width="80px"
                  height="80px"
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
