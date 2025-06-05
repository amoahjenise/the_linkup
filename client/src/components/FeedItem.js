import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useFeedItemUtils from "../hooks/useFeedItemUtils";
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
              className="text-[30px] sm:text-[24px] font-['Segoe_UI_Emoji']"
            >
              <div className="flex justify-between w-full h-full">
                <IoReceipt />
                <IoReceipt />
              </div>
            </span>
          </Tooltip>
        );
      case "iWillPay":
        return (
          <Tooltip title="I'll pay!">
            <span
              role="img"
              aria-label="i'll pay"
              className="text-[30px] font-['Segoe_UI_Emoji','Apple_Color_Emoji','Segoe_UI','Roboto',sans-serif]"
            >
              <div className="flex justify-between w-full h-full">
                <IoReceipt />
              </div>
            </span>
          </Tooltip>
        );
      case "pleasePay":
        return (
          <div className="inline-block">
            <EmojiTooltip />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-2 w-full bg-transparent">
      <div
        className={`w-full min-h-[260px] p-5 rounded-xl transition-all duration-200 ease-in-out cursor-pointer
        ${
          colorMode === "dark"
            ? "bg-[hsl(210,20%,15%)] border-[hsl(210,18%,25%)] shadow-[0_4px_12px_hsla(210,100%,50%,0.08)]"
            : "bg-white border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
        }
        hover:-translate-y-0.5
        ${
          colorMode === "light"
            ? "hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]"
            : "hover:shadow-[0_6px_12px_rgba(255,255,255,0.05)]"
        }
        sm:p-5 sm:min-h-[250px]`}
      >
        <div className="flex w-full">
          <div className="flex-1 min-w-0 mr-4 flex flex-col break-words w-full">
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center gap-2">
                <div className="text-base font-semibold text-inherit">
                  <Link
                    to={`/profile/${creator_id}`}
                    className="text-base font-semibold text-inherit"
                  >
                    {creator_name || "Undefined contacts"}
                  </Link>
                </div>
                {creator_name && (
                  <Tooltip
                    title={linkup.is_online ? "Online" : "Offline"}
                    arrow
                  >
                    <div
                      className={`w-2 h-2 rounded-full ml-2 ${
                        linkup.is_online ? "bg-[#31A24C]" : "bg-[#B0B3B8]"
                      }`}
                    />
                  </Tooltip>
                )}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500 gap-3 font-normal capitalize">
              <span>{getTimeAgo(created_at)}</span>
            </div>
            <div
              className={`leading-6 text-[0.95rem] font-['Roboto','Helvetica_Neue',Helvetica,Arial,sans-serif] break-words
              ${colorMode === "light" ? "text-[#1C1E21]" : "text-[#E4E6EB]"}`}
            >
              {formatActivityText(
                activity,
                creator_name,
                creator_id,
                formattedDate,
                "text-[1.05rem] font-semibold"
              )}
              <div
                className={`mt-2 text-[0.9rem] font-medium
                ${colorMode === "light" ? "text-[#606770]" : "text-[#B0B3B8]"}`}
              >
                Location: {capitalizeLocation(location)}
              </div>
            </div>
            <div
              className={`flex items-center justify-between w-full pt-2 border-t
              ${
                colorMode === "dark"
                  ? "border-[hsl(210,18%,25%)]"
                  : "border-gray-200"
              }`}
            >
              {loggedUser.id !== linkup.creator_id && (
                <PostActions
                  paymentOption={linkup.payment_option}
                  onRequestClick={() => handleRequestLinkup(linkup.id)}
                  disableRequest={disableRequest}
                />
              )}
              <span>{renderPaymentOptionIcon()}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="ml-auto">
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
                <div className="flex items-center text-gray-500 text-[0.85rem] font-['system-ui','-apple-system','BlinkMacSystemFont','Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
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
                </div>
              )}
            </div>
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
      </div>
    </div>
  );
};

export default React.memo(FeedItem, areEqual);
