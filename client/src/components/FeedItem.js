import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useFeedItemUtils from "../hooks/useFeedItemUtils";
import { styled } from "@mui/material/styles";
import { useColorMode } from "@chakra-ui/react";
import UserAvatar from "./UserAvatar";
import MoreMenu from "./MoreMenu";
import PostActions from "./PostActions";
import { CircularProgress } from "@mui/material";
import EmojiTooltip from "./EmojiTooltip";
import { Tooltip } from "@mui/material";
import { IoReceipt } from "react-icons/io5";
import { useSnackbar } from "../contexts/SnackbarContext";
import { getLinkupStatus } from "../api/linkUpAPI";

const Container = styled("div")(({ theme }) => ({
  padding: "0.8rem",
  width: "100%",
  backgroundColor: "transparent",
}));

const CardContainer = styled("div")(({ theme, colorMode }) => ({
  width: "100%",
  minHeight: "260px",
  padding: "1.2rem",
  borderRadius: "12px",
  backgroundColor: colorMode === "dark" ? "hsl(210, 20%, 15%)" : "#FFFFFF",
  border:
    colorMode === "dark" ? "1px solid hsl(210, 18%, 25%)" : "1px solid #e5e7eb",
  boxShadow:
    colorMode === "dark"
      ? "0 4px 12px hsla(210, 100%, 50%, 0.08)"
      : "0 2px 8px rgba(0, 0, 0, 0.05)",
  transition: "all 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      colorMode === "light"
        ? "0 6px 12px rgba(0, 0, 0, 0.1)"
        : "0 6px 12px rgba(255, 255, 255, 0.05)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "1.2rem",
    minHeight: "250px",
  },
}));

const PostContent = styled("div")(({ colorMode, theme }) => ({
  lineHeight: "1.6",
  fontSize: "0.95rem",
  fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  color: colorMode === "light" ? "#1C1E21" : "#E4E6EB",
  wordWrap: "break-word",
  "& div:first-of-type": {
    fontWeight: "600",
    fontSize: "1.05rem",
    color: colorMode === "light" ? "#242526" : "#DADDE1",
    marginBottom: "0.5rem",
  },
  "& div:last-of-type": {
    marginTop: "0.5rem",
    fontWeight: "500",
    fontSize: "0.9rem",
    color: colorMode === "light" ? "#606770" : "#B0B3B8",
  },
}));

const PaymentOptionIconContainer = styled("div")({
  display: "inline-block",
});

const PostActionsContainer = styled("div")(({ theme, colorMode }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingTop: "0.5rem",
  borderTop:
    colorMode === "dark" ? "1px solid hsl(210, 18%, 25%)" : "1px solid #e5e7eb",
}));

const UserInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  marginBottom: "0.75rem",
}));

const MoreMenuContainer = styled("div")({
  marginLeft: "auto",
});

const UserName = styled("div")({
  fontSize: "1rem",
  fontWeight: "600",
  color: "inherit",
});

const Name = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

const DistanceInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: "#718096",
  fontSize: "0.85rem",
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}));

const PostInfo = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontSize: "0.85rem",
  color: "#718096",
  gap: "0.75rem",
  fontWeight: "400",
  textTransform: "capitalize",
}));

const LeftSide = styled("div")(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  marginRight: "1rem",
  display: "flex",
  flexDirection: "column",
  overflowWrap: "break-word",
  width: "100%",
}));

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
  width: "100%",
  height: "100%",
});

const areEqual = (prevProps, nextProps) =>
  prevProps.linkup.id === nextProps.linkup.id &&
  prevProps.linkup.updatedAt === nextProps.linkup.updatedAt;

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
  const distanceInKm = useDistance(loggedUser, latitude, longitude);
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
                ...(window.innerWidth < 600 && { fontSize: "24px" }),
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
        <div style={{ display: "flex", width: "100%" }}>
          <LeftSide>
            <UserInfo>
              <Name>
                <UserName>
                  <Link to={`/profile/${creator_id}`} className={UserName}>
                    {creator_name || "Undefined contacts"}
                  </Link>
                </UserName>
                {creator_name && (
                  <Tooltip
                    title={linkup.is_online ? "Online" : "Offline"}
                    arrow
                  >
                    <OnlineIndicator isOnline={linkup.is_online} />
                  </Tooltip>
                )}
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
            <PostActionsContainer colorMode={colorMode}>
              {loggedUser.id !== linkup.creator_id && (
                <PostActions
                  paymentOption={linkup.payment_option}
                  onRequestClick={() => handleRequestLinkup(linkup.id)}
                  disableRequest={disableRequest}
                />
              )}
              <span>{renderPaymentOptionIcon()}</span>
            </PostActionsContainer>
          </LeftSide>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "1rem",
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
            {creator_name && (
              <UserAvatar
                userData={{
                  id: creator_id,
                  name: creator_name,
                  avatar: avatar,
                }}
                width="100px"
                height="100px"
              />
            )}
          </div>
        </div>
      </CardContainer>
    </Container>
  );
};

export default React.memo(FeedItem, areEqual);
