import React, { useState, forwardRef } from "react";
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
import { FiMapPin, FiCalendar } from "react-icons/fi";

const areEqual = (prevProps, nextProps) =>
  prevProps.linkup.id === nextProps.linkup.id &&
  prevProps.linkup.updatedAt === nextProps.linkup.updatedAt;

const FeedItem = forwardRef(
  (
    {
      linkup,
      addLinkup,
      updateLinkup,
      removeLinkup,
      handleScrollToTop,
      loggedUser,
      sentRequests,
    },
    ref
  ) => {
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

      const isDisabled = sentRequests.has(linkupId); // fresh check

      switch (response.linkupStatus) {
        case "expired":
          message = "This linkup has expired.";
          break;
        case "closed":
          message =
            "This linkup was closed and can no longer receive requests.";
          break;
        case "inactive":
          message = "This linkup was deleted.";
          break;
        default:
          const destination = isDisabled
            ? `/history/requests-sent`
            : `/send-request/${linkupId}`;
          navigate(destination);
          return;
      }

      if (!isDisabled) {
        addSnackbar(message, { timeout: 7000 });
      }
    };

    const renderPaymentOptionIcon = () => {
      switch (linkup.payment_option) {
        case "split":
          return (
            <Tooltip title="Let's split the bill!">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                <IoReceipt className="text-lg" />
              </div>
            </Tooltip>
          );
        case "iWillPay":
          return (
            <Tooltip title="I'll pay!">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300">
                <IoReceipt className="text-lg" />
              </div>
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

    const renderDistance = () => {
      if (!distanceInKm) return <CircularProgress size={16} />;

      const distance = parseFloat(distanceInKm);
      if (isNaN(distance)) return "Nearby";

      if (distance < 0.5) return "< 500m away";
      if (distance < 1) return "< 1 km away";
      return `${distance.toFixed(1)} km away`;
    };

    return (
      <div ref={ref} className="px-2 py-0.5 w-full bg-transparent">
        <div
          className={`w-full min-h-[220px] p-4 rounded-lg transition-all duration-200 ease-in-out cursor-pointer
        ${
          colorMode === "dark"
            ? "bg-gray-800 border-gray-700 shadow-md hover:shadow-lg hover:shadow-blue-900/10"
            : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:shadow-blue-500/10"
        }
        hover:-translate-y-0.5 border mb-1`}
        >
          <div className="flex w-full gap-3">
            <div className="flex-1 min-w-0 flex flex-col break-words w-full">
              <div className="flex items-center justify-between w-full mb-3">
                <div className="flex items-center gap-2">
                  <UserAvatar
                    userData={{
                      id: creator_id,
                      name: creator_name,
                      avatar: avatar,
                    }}
                    width="60px"
                    height="60px"
                    className="border border-white shadow-xs"
                  />
                  <div>
                    <Link
                      to={`/profile/${creator_id}`}
                      className={`text-base font-semibold hover:underline ${
                        colorMode === "light" ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {creator_name || "Undefined contacts"}
                    </Link>
                    <div className="flex items-center text-xs mt-0.5">
                      <span
                        className={`${
                          colorMode === "light"
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        {getTimeAgo(created_at)}
                      </span>
                      {creator_name && (
                        <Tooltip
                          title={linkup.is_online ? "Online" : "Offline"}
                          arrow
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ml-1.5 ${
                              linkup.is_online ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>

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
                    <div className="flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {renderDistance()}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`leading-normal text-sm mb-3 font-['Inter',sans-serif] break-words
              ${colorMode === "light" ? "text-gray-700" : "text-gray-200"}`}
              >
                {formatActivityText(
                  activity,
                  creator_name,
                  creator_id,
                  formattedDate,
                  "text-base font-semibold mb-1"
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  <div
                    className={`flex items-center text-xs ${
                      colorMode === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    <FiCalendar className="mr-1" size={14} />
                    {formattedDate}
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      colorMode === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    <FiMapPin className="mr-1" size={14} />
                    {capitalizeLocation(location)}
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center justify-between w-full pt-3 mt-auto border-t ${
                  colorMode === "dark" ? "border-gray-700" : "border-gray-100"
                }`}
              >
                {loggedUser.id !== linkup.creator_id && (
                  <PostActions
                    paymentOption={linkup.payment_option}
                    onRequestClick={() => handleRequestLinkup(linkup.id)}
                    disableRequest={disableRequest}
                  />
                )}
                <div className="ml-auto">{renderPaymentOptionIcon()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default React.memo(FeedItem, areEqual);
