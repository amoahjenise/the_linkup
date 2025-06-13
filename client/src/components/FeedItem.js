// FeedItem.js (Updated)
import React, { useState, forwardRef, useEffect } from "react";
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
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

    useEffect(() => {
      const handleMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);

    const handleMouseEnter = () => setTilt({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * 5;
      const tiltY = ((centerX - x) / centerX) * 5;
      setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
      setTimeout(() => {
        setTilt({ x: 0, y: 0 });
      }, 100);
    };

    const handleRequestLinkup = async (linkupId) => {
      const response = await getLinkupStatus(linkupId);
      const isDisabled = sentRequests.has(linkupId);
      let message = "";

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
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100/70 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                <IoReceipt className="text-sm" />
                <IoReceipt className="text-sm" />
              </div>
            </Tooltip>
          );
        case "iWillPay":
          return (
            <Tooltip title="I'll pay!">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100/70 dark:bg-green-900/30 text-green-600 dark:text-green-300 border border-green-200/50 dark:border-green-800/50">
                <IoReceipt className="text-base" />
              </div>
            </Tooltip>
          );
        case "pleasePay":
          return (
            <div className="w-8 h-8 flex items-center justify-center">
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
          className={`w-full min-h-[180px] p-2.5 rounded-xl transition-all duration-500 ease-out cursor-pointer relative overflow-hidden
            ${
              colorMode === "dark"
                ? "bg-gray-800/30 backdrop-blur-md border border-gray-700/50 shadow-lg hover:shadow-xl"
                : "bg-white/70 backdrop-blur-md border border-gray-200/50 shadow-sm hover:shadow-md"
            }
            hover:-translate-y-0.5 mb-2`} // Reduced spacing
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99)",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(500px circle at ${
                mousePosition.x
              }px ${mousePosition.y}px, rgba(255, 255, 255, ${
                colorMode === "dark" ? "0.05" : "0.2"
              }) 0%, rgba(255, 255, 255, 0) 70%)`,
              mask: "linear-gradient(transparent, white 20%, white 80%, transparent)",
              WebkitMask:
                "linear-gradient(transparent, white 20%, white 80%, transparent)",
            }}
          />

          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 10px rgba(255, 255, 255, ${
                colorMode === "dark" ? "0.1" : "0.2"
              })`,
            }}
          />

          <div className="relative z-10 flex w-full gap-2">
            {" "}
            {/* Reduced gap */}
            <div className="flex-1 min-w-0 flex flex-col break-words w-full">
              <div className="flex items-center justify-between w-full mb-1.5">
                {" "}
                {/* Reduced mb */}
                <div className="flex items-center gap-1.5">
                  {" "}
                  {/* Reduced gap */}
                  <UserAvatar
                    userData={{
                      id: creator_id,
                      name: creator_name,
                      avatar: avatar,
                    }}
                    width="50px"
                    height="50px"
                    className="border-2 border-white/50 shadow-lg"
                  />
                  <div>
                    <Link
                      to={`/profile/${creator_id}`}
                      className={`text-sm font-semibold hover:underline ${
                        colorMode === "light" ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {creator_name || "Undefined contacts"}
                    </Link>
                    <div className="flex items-center text-xs mt-0.5">
                      <span
                        className={`${
                          colorMode === "light"
                            ? "text-gray-600"
                            : "text-gray-300"
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
                    <div
                      className={`flex items-center text-xs px-3 py-1 rounded-full ${
                        colorMode === "light"
                          ? "bg-white/80 text-gray-700 border border-gray-200/50 shadow-sm"
                          : "bg-gray-800/50 text-gray-300 border border-gray-700/50 shadow-sm"
                      }`}
                    >
                      {renderDistance()}
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`leading-snug text-sm font-['Inter',sans-serif] mb-1.5 break-words ${
                  colorMode === "light" ? "text-gray-700" : "text-gray-200"
                }`}
              >
                {formatActivityText(
                  activity,
                  creator_name,
                  creator_id,
                  formattedDate,
                  "text-sm font-medium mb-1"
                )}

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {" "}
                  {/* Reduced gap and mt */}
                  <div
                    className={`flex items-center text-xs px-2.5 py-1 rounded-full ${
                      colorMode === "light"
                        ? "bg-white/80 text-gray-700 border border-gray-200/50"
                        : "bg-gray-800/50 text-gray-300 border border-gray-700/50"
                    }`}
                  >
                    <FiCalendar className="mr-2" size={12} />
                    {formattedDate}
                  </div>
                  <div
                    className={`flex items-center text-xs px-2.5 py-1 rounded-full ${
                      colorMode === "light"
                        ? "bg-white/80 text-gray-700 border border-gray-200/50"
                        : "bg-gray-800/50 text-gray-300 border border-gray-700/50"
                    }`}
                  >
                    <FiMapPin className="mr-2" size={12} />
                    {capitalizeLocation(location)}
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center justify-between w-full pt-2 mt-auto border-t ${
                  colorMode === "dark"
                    ? "border-gray-700/50"
                    : "border-gray-200/50"
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
