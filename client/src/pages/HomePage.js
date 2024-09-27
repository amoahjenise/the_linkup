import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import FeedSection from "../components/FeedSection";
import WidgetSection from "../components/WidgetSection";
import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";
import { fetchLinkupRequestsSuccess } from "../redux/actions/userSentRequestsActions";
import { getLinkups } from "../api/linkUpAPI";
import { getLinkupRequests } from "../api/linkupRequestAPI";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";
import { showNewLinkupButton } from "../redux/actions/linkupActions";

const PREFIX = "HomePage";
const classes = {
  homePage: `${PREFIX}-homePage`,
  feedSection: `${PREFIX}-feedSection`,
  widgetSection: `${PREFIX}-widgetSection`,
  fab: `${PREFIX}-fab`,
};

const StyledDiv = styled("div")(({ theme, colorMode, isWidgetVisible }) => ({
  [`&.${classes.homePage}`]: {
    display: "flex",
    width: "100%",
    position: "relative",
  },
  [`&.${classes.feedSection}`]: {
    flex: 2,
    overflowY: "auto",
    borderRight: `1px solid ${colorMode === "dark" ? "#2D3748" : "#D3D3D3"}`,
    [theme.breakpoints.down("sm")]: {
      flex: 1,
    },
  },
  [`&.${classes.widgetSection}`]: {
    flex: 1,
    overflowY: "auto",
    display: "block",
    [theme.breakpoints.down("md")]: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      backgroundColor: colorMode === "dark" ? "rgba(0, 0, 0, 1)" : "white",
      boxShadow: "-2px 0px 5px rgba(0, 0, 0, 0.1)",
      zIndex: 2000,
      transform: isWidgetVisible ? "translateX(0)" : "translateX(100%)",
      opacity: isWidgetVisible ? 1 : 0,
      transition: "transform 0.3s ease, opacity 0.3s ease",
      overflowY: "auto",
    },
  },
}));

const MobileCreateButton = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "60px",
  height: "60px",
  backgroundColor: "rgba(0, 151, 167, 0.7)",
  "&:hover": {
    backgroundColor: "rgba(0, 123, 134, 0.7)",
  },
  color: theme.palette.primary.contrastText,
  borderRadius: "50%",
  position: "fixed",
  bottom: "80px",
  right: "20px",
  zIndex: 2100,
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
}));

const PAGE_SIZE = 10;

const HomePage = ({ isMobile }) => {
  const dispatch = useDispatch();
  const feedSectionRef = useRef(null);
  const linkupList = useSelector((state) => state.linkups.linkupList);
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser.user.id;
  const gender = loggedUser.user.gender;
  const latitude = loggedUser.user.latitude;
  const longitude = loggedUser.user.longitude;
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(true);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const totalPages = Math.ceil(linkupList[0]?.total_active_linkups / PAGE_SIZE);
  const { colorMode } = useColorMode();

  const fetchLinkupsAndPoll = useCallback(
    async (page) => {
      setIsFetchingNextPage(true);
      try {
        if (!userId) return;

        const adjustedPage = page - 1;
        const sqlOffset = adjustedPage * PAGE_SIZE;

        const response = await getLinkups(
          userId,
          gender,
          sqlOffset,
          PAGE_SIZE,
          latitude,
          longitude
        );

        if (response.success) {
          const activeLinkups = response.linkupList.filter(
            (linkup) => linkup.status === "active"
          );

          const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Radius of the Earth in km
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a =
              0.5 -
              Math.cos(dLat) / 2 +
              (Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                (1 - Math.cos(dLon))) /
                2;
            return R * 2 * Math.asin(Math.sqrt(a));
          };

          const updatedLinkupList = activeLinkups.map((linkup) => ({
            ...linkup,
            distance: calculateDistance(
              latitude,
              longitude,
              linkup.latitude,
              linkup.longitude
            ),
            recency: Date.now() - new Date(linkup.created_at).getTime(),
          }));

          // Sort all linkups by recency first
          updatedLinkupList.sort((a, b) => {
            if (a.recency !== b.recency) return a.recency - b.recency;
            if (a.distance !== b.distance) return a.distance - b.distance;
            return new Date(a.scheduled_at) - new Date(b.scheduled_at);
          });

          // Get the last created linkup for the connected user (if available)
          const userLinkups = updatedLinkupList.filter(
            (linkup) => linkup.creator_id === userId
          );

          // If there are user linkups, prioritize the most recent one
          const prioritizedLinkup =
            userLinkups.length > 0 ? userLinkups[0] : null;

          // If there’s a prioritized linkup, move it to the top
          const combinedLinkups = prioritizedLinkup
            ? [
                prioritizedLinkup,
                ...updatedLinkupList.filter(
                  (linkup) => linkup.id !== prioritizedLinkup.id
                ),
              ]
            : updatedLinkupList;

          // Identify unique linkups to add to state
          const existingLinkupIds = new Set(
            linkupList.map((linkup) => linkup.id)
          );
          const uniqueLinkups = combinedLinkups.filter(
            (linkup) => !existingLinkupIds.has(linkup.id)
          );

          // Only dispatch if there are new unique linkups to add
          if (uniqueLinkups.length > 0) {
            dispatch(fetchLinkupsSuccess([...uniqueLinkups, ...linkupList]));
          }

          setCurrentPage(page);
        } else {
          console.error("Error fetching linkups:", response.message);
        }
      } catch (error) {
        console.error("Error fetching linkups:", error);
      } finally {
        setIsFetchingNextPage(false);
      }
    },
    [dispatch, gender, latitude, longitude, userId, linkupList]
  );

  const handleScroll = useCallback(() => {
    const threshold = 10;
    if (
      feedSectionRef.current &&
      feedSectionRef.current.scrollHeight - feedSectionRef.current.scrollTop <=
        feedSectionRef.current.clientHeight + threshold
    ) {
      if (currentPage < totalPages && !isFetchingNextPage) {
        fetchLinkupsAndPoll(currentPage + 1);
      }
    }
  }, [currentPage, fetchLinkupsAndPoll, isFetchingNextPage, totalPages]);

  useEffect(() => {
    if (shouldFetchLinkups) {
      fetchLinkupsAndPoll(1);
      setShouldFetchLinkups(false);
    }
  }, [fetchLinkupsAndPoll, shouldFetchLinkups]);

  useEffect(() => {
    const scrollContainer = feedSectionRef.current;
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const fetchLinkupRequests = useCallback(async () => {
    try {
      dispatch(showNewLinkupButton(false));
      if (!userId) return;
      const response = await getLinkupRequests(userId);
      if (response.success) {
        dispatch(fetchLinkupRequestsSuccess(response.linkupRequestList));
      } else {
        console.error("Error fetching linkup requests:", response.message);
      }
    } catch (error) {
      console.error("Error fetching linkup requests:", error);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    fetchLinkupRequests();
  }, [fetchLinkupRequests]);

  const refreshLinkups = useCallback(() => {
    dispatch(showNewLinkupButton(false));
    fetchLinkupsAndPoll(1);
    scrollToTop();
  }, [dispatch, fetchLinkupsAndPoll]);

  const scrollToTop = () => {
    if (feedSectionRef.current) {
      feedSectionRef.current.scrollTop = 0;
    }
  };

  const toggleWidget = () => {
    setIsWidgetVisible((prev) => !prev);
  };

  return (
    <StyledDiv className={classes.homePage} colorMode={colorMode}>
      <StyledDiv
        className={classes.feedSection}
        ref={feedSectionRef}
        colorMode={colorMode}
      >
        <FeedSection
          linkupList={linkupList}
          isLoading={isFetchingNextPage}
          setShouldFetchLinkups={setShouldFetchLinkups}
          onRefreshClick={refreshLinkups}
        />
      </StyledDiv>
      <StyledDiv
        className={classes.widgetSection}
        colorMode={colorMode}
        isWidgetVisible={isWidgetVisible}
      >
        <WidgetSection
          setIsWidgetVisible={setIsWidgetVisible}
          setShouldFetchLinkups={setShouldFetchLinkups}
          scrollToTopCallback={scrollToTop}
          userId={userId}
          gender={gender}
        />
      </StyledDiv>
      {isMobile && (
        <MobileCreateButton onClick={toggleWidget}>
          {isWidgetVisible ? <CloseIcon /> : <AddIcon />}
        </MobileCreateButton>
      )}
    </StyledDiv>
  );
};

export default HomePage;
