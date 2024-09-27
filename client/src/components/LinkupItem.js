import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import moment from "moment";
import UserAvatar from "./UserAvatar";
import HorizontalMenu from "./HorizontalMenu";
import PostActions from "./PostActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import { getLinkupStatus } from "../api/linkUpAPI";
import { IoReceipt } from "react-icons/io5";
import nlp from "compromise";
import { useColorMode } from "@chakra-ui/react"; // Import useColorMode from Chakra UI
import EmojiTooltip from "./EmojiTooltip";
import { Tooltip } from "@mui/material";

const compromise = nlp;

// Styled Components
const Container = styled("div")(({ theme }) => ({
  padding: "0.75rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  borderBottom: "1px solid #D3D3D3",
}));

const CardContainer = styled("div")(({ theme, isHovered, colorMode }) => ({
  border: `1px solid ${
    colorMode === "light"
      ? "rgba(229, 235, 243, 1)" // Light border for light mode
      : "rgba(229, 235, 243, 0.2)" // Subtle border for dark mode
  }`,
  padding: "1.5rem",
  borderRadius: "1.5rem", // Large rounded corners for a soft feel
  width: "100%",
  background:
    colorMode === "light"
      ? "#ffffff" // Solid white background for light mode
      : "linear-gradient(135deg, rgba(130, 131, 129, 0.08), rgba(130, 131, 129, 0.12))", // Subtle gradient for dark mode
  backdropFilter: "blur(10px)", // Glass-like background effect

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
        : "0 12px 24px rgba(255, 255, 255, 0.1), 0 4px 6px rgba(80, 80, 0, 0.025)", // Hover shadow for dark mode
  },
  cursor: "pointer",
}));

const HorizontalMenuContainer = styled("div")(({ theme }) => ({
  marginLeft: "auto",
}));

const UserName = styled("div")(({ theme }) => ({
  fontSize: "1rem",
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
  fontSize: "0.9rem",
  color: "#718096",
  marginTop: "0.25rem",
  marginLeft: "4px",
}));

const PostContent = styled("div")(({ theme, colorMode }) => ({
  marginTop: "1rem",
  lineHeight: "1rem",
  // Date/Time style
  "& div:first-of-type": {
    fontWeight: "600", // semi bold
    color: colorMode === "light" ? "#616871" : "#c3c4c4",
  },
  // Post Text style
  "& p": {
    marginTop: "6px",
    lineHeight: "1.5rem",
    fontWeight: "500", // semi bold
    color: colorMode === "light" ? "#282b2e" : "white",
  },
  // Location style
  "& div:last-of-type": {
    marginTop: "5px",
    fontWeight: "500", // semi bold
    fontSize: "0.95rem", // smaller font
    color: colorMode === "light" ? "#282b2e" : "white",
  },
}));

const PostInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontSize: "0.9rem",
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

const formatDate = (date) => moment(date).format("ddd, MMM DD - h:mm A z");

const capitalizeLocation = (location) =>
  location
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const LinkupItem = ({ linkupItem, setShouldFetchLinkups, disableRequest }) => {
  const { colorMode } = useColorMode(); // Use useColorMode hook
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [distance, setDistance] = useState(null);
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
  // const [isOnline, setIsOnline] = useState(false); // State for online status

  // useEffect(() => {
  //   // Simulate online status
  //   const fetchOnlineStatus = async () => {
  //     // You can replace this with actual API call to fetch online status
  //     const response = await fetch(`/api/users/${creator_id}/status`);
  //     const data = await response.json();
  //     setIsOnline(data.isOnline);
  //   };

  //   fetchOnlineStatus();
  // }, [creator_id]);

  useEffect(() => {
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const toRadians = (degrees) => (degrees * Math.PI) / 180;

      const R = 6371; // Radius of the Earth in kilometers
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon1 - lon2);
      const a =
        Math.sin(dLat) * Math.sin(dLat) +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon) *
          Math.sin(dLon);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            const dist = calculateDistance(
              userLat,
              userLon,
              latitude,
              longitude
            );
            setDistance(dist.toFixed(0)); // Set distance with 2 decimal places
          },
          (error) => {
            console.error("Error fetching user's location:", error);
          }
        );
      }
    };

    fetchUserLocation();
  }, [latitude, longitude]);

  // Function to render the appropriate icon based on the payment option
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
    <Container>
      <CardContainer
        isHovered={isHovered}
        colorMode={colorMode}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <UserInfo>
          <div style={{ display: "flex", alignItems: "center" }}>
            <UserAvatar
              userData={{
                id: creator_id,
                name: creator_name,
                avatar: avatar,
              }}
              width="60px"
              height="60px"
            />
            <div>
              <Name>
                <UserName>{creator_name}</UserName>
                <OnlineIndicator isOnline={linkupItem.is_online} />
              </Name>
              <PostInfo>
                <span>{getTimeAgo(created_at)}</span>
              </PostInfo>
            </div>
          </div>
          <HorizontalMenuContainer>
            {loggedUser.user.id === linkupItem.creator_id ? (
              <HorizontalMenu
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
                {distance && <span>{`${distance} km away`}</span>}
              </DistanceInfo>
            )}
          </HorizontalMenuContainer>
        </UserInfo>

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
      </CardContainer>
    </Container>
  );
};

export default LinkupItem;
