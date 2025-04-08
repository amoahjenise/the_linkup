import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import FeedSection from "../components/FeedSection";
import WidgetSection from "../components/WidgetSection";
import { mergeLinkupsSuccess } from "../redux/actions/linkupActions";
import { fetchLinkupRequestsSuccess } from "../redux/actions/userSentRequestsActions";
import { getLinkups } from "../api/linkUpAPI";
import { getLinkupRequests } from "../api/linkupRequestAPI";
import { IconButton } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";
import { showNewLinkupButton } from "../redux/actions/linkupActions";
import LoadingSpinner from "../components/LoadingSpinner";
import useLocationUpdate from "../hooks/useLocationUpdate";
import { debounce } from "lodash";

const PREFIX = "HomePage";
const classes = {
  homePage: `${PREFIX}-homePage`,
  feedSection: `${PREFIX}-feedSection`,
  widgetSection: `${PREFIX}-widgetSection`,
  widgetButton: `${PREFIX}-widgetButton`,
  widgetCloseButton: `${PREFIX}-widgetCloseButton`,
  loadingContainer: `${PREFIX}-loadingContainer`,
  slideIn: `${PREFIX}-slideIn`,
  slideOut: `${PREFIX}-slideOut`,
};

const StyledDiv = styled("div")(({ theme, colorMode }) => ({
  [`&.${classes.homePage}`]: {
    display: "flex",
    width: "100%",
    position: "relative",
  },
  [`&.${classes.feedSection}`]: {
    flex: "2.5",
    overflowY: "auto",
    borderRightColor: colorMode === "dark" ? "#2D3748" : "#D3D3D3",
    [theme.breakpoints.down("md")]: {
      flex: "2",
    },
    [theme.breakpoints.down("sm")]: {
      flex: "1",
    },
  },
  [`&.${classes.widgetSection}`]: {
    flex: "1.5",
    overflowY: "auto",
    display: "block",
    transition: "width 0.3s ease",
    borderLeftWidth: "1px",

    [theme.breakpoints.down("md")]: {
      flex: "2",
    },
    [theme.breakpoints.down("sm")]: {
      flex: "2",
      position: "fixed",
      top: 0,
      right: 0,
      width: "100%",
      height: "100dvh",
      borderLeftWidth: 0,
      backgroundColor: colorMode === "dark" ? "black" : "white",
      boxShadow: "-2px 0px 5px rgba(0, 0, 0, 0.1)",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      zIndex: 2000,
      maxHeight: "100dvh",
      overflowY: "auto",
    },
  },
  [`&.${classes.widgetButton}`]: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1100,
    borderRadius: "50%",
    backgroundColor: theme.palette.mode === "dark" ? "#2D3748" : "#D3D3D3",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  [`&.${classes.widgetCloseButton}`]: {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: 1100,
  },
  [`&.${classes.slideIn}`]: {
    transform: "translateX(0)",
  },
  [`&.${classes.slideOut}`]: {
    transform: "translateX(100%)",
  },
  [`&.${classes.loadingContainer}`]: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100dvh",
  },
}));

const PAGE_SIZE = 5;

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
  const [fetchedLinkupIds, setFetchedLinkupIds] = useState([]);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const totalPages = Math.ceil(linkupList[0]?.total_active_linkups / PAGE_SIZE);
  const { colorMode } = useColorMode();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 600);
  const wasManuallyToggled = useRef(false);

  useLocationUpdate();

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
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

  const fetchLinkupsAndPoll = useCallback(
    async (page) => {
      setIsFetchingNextPage(true);
      try {
        if (!userId || page < 1 || PAGE_SIZE < 1) return;

        const adjustedPage = page - 1;
        const sqlOffset = adjustedPage * PAGE_SIZE;

        const response = await getLinkups(
          userId,
          gender,
          0,
          sqlOffset + PAGE_SIZE,
          latitude,
          longitude
        );

        if (response.success) {
          const activeLinkups = response.linkupList.filter(
            (linkup) => linkup.status === "active"
          );

          const updatedLinkupList = activeLinkups.map((linkup) => ({
            ...linkup,
            isUserCreated: linkup.creator_id === userId,
            createdAtTimestamp: linkup.created_at,
            distance: calculateDistance(
              latitude,
              longitude,
              linkup.latitude,
              linkup.longitude
            ),
          }));

          updatedLinkupList.sort((a, b) => {
            const createdAtComparison =
              new Date(b.createdAtTimestamp) - new Date(a.createdAtTimestamp);
            if (createdAtComparison !== 0) return createdAtComparison;
            return a.distance - b.distance;
          });

          // Use merge action instead of replace/append
          dispatch(mergeLinkupsSuccess(updatedLinkupList, page === 1));

          setCurrentPage(page);
          const newFetchedLinkupIds = updatedLinkupList.map(
            (linkup) => linkup.id
          );
          setFetchedLinkupIds((prev) => [
            ...new Set([...prev, ...newFetchedLinkupIds]),
          ]);
        } else {
          console.error("Error fetching linkups:", response.message);
        }
      } catch (error) {
        console.error("Error fetching linkups:", error);
      } finally {
        setIsFetchingNextPage(false);
        setIsLoading(false);
      }
    },
    [dispatch, gender, latitude, longitude, userId]
  );

  const handleScroll = useCallback(() => {
    const threshold = 5;
    if (
      feedSectionRef.current &&
      feedSectionRef.current.scrollHeight - feedSectionRef.current.scrollTop <=
        feedSectionRef.current.clientHeight + threshold
    ) {
      if (currentPage < totalPages && !isFetchingNextPage) {
        // Save current scroll position
        const scrollTop = feedSectionRef.current.scrollTop;
        const scrollHeight = feedSectionRef.current.scrollHeight;

        fetchLinkupsAndPoll(currentPage + 1).then(() => {
          // Restore scroll position after update
          if (feedSectionRef.current) {
            const newScrollHeight = feedSectionRef.current.scrollHeight;
            feedSectionRef.current.scrollTop =
              scrollTop + (newScrollHeight - scrollHeight);
          }
        });
      }
    }
  }, [currentPage, fetchLinkupsAndPoll, isFetchingNextPage, totalPages]);

  useEffect(() => {
    if (loggedUser.user.id) {
      setShouldFetchLinkups(true);
    }
  }, [loggedUser]);

  useEffect(() => {
    if (userId && shouldFetchLinkups) {
      fetchLinkupsAndPoll(1);
      setShouldFetchLinkups(false);
    }
  }, [fetchLinkupsAndPoll, shouldFetchLinkups, userId]);

  useEffect(() => {
    const scrollContainer = feedSectionRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  const fetchLinkupRequests = useCallback(async () => {
    try {
      dispatch(showNewLinkupButton(false));
      if (!userId) return;
      const response = await getLinkupRequests(userId);
      if (response.success) {
        dispatch(fetchLinkupRequestsSuccess(response.linkupRequestList));
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

  const toggleWidget = useCallback(() => {
    wasManuallyToggled.current = true;
    setIsWidgetVisible((prev) => !prev);
  }, []);

  const handleResize = useCallback(() => {
    const newIsMobile = window.innerWidth <= 600;
    setIsMobileView(newIsMobile);

    if (!wasManuallyToggled.current) {
      setIsWidgetVisible(!newIsMobile);
    }
  }, []);

  useEffect(() => {
    const initialIsMobile = window.innerWidth <= 600;
    setIsMobileView(initialIsMobile);
    setIsWidgetVisible(!initialIsMobile);

    const debouncedHandleResize = debounce(() => {
      const currentIsMobile = window.innerWidth <= 600;
      if (isMobileView !== currentIsMobile) {
        handleResize();
      }
    }, 100);

    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [handleResize, isMobileView]);

  useEffect(() => {
    wasManuallyToggled.current = false;
  }, [isMobileView]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <StyledDiv className={classes.homePage} colorMode={colorMode}>
      <StyledDiv className={classes.feedSection} ref={feedSectionRef}>
        {userId && (
          <FeedSection
            linkupList={linkupList}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setShouldFetchLinkups={setShouldFetchLinkups}
            onRefreshClick={refreshLinkups}
            userId={userId}
            gender={gender}
            feedRef={feedSectionRef}
          />
        )}
      </StyledDiv>
      <StyledDiv
        className={`${classes.widgetSection} ${
          isWidgetVisible ? classes.slideIn : classes.slideOut
        }`}
        colorMode={colorMode}
      >
        {isMobileView && (
          <IconButton
            className={classes.widgetCloseButton}
            onClick={toggleWidget}
            onTouchStart={(e) => e.preventDefault()}
          >
            <CloseIcon
              style={{ color: colorMode === "dark" ? "white" : "black" }}
            />
          </IconButton>
        )}
        <WidgetSection
          toggleWidget={toggleWidget}
          setShouldFetchLinkups={setShouldFetchLinkups}
          scrollToTopCallback={scrollToTop}
          isMobile={isMobileView}
        />
      </StyledDiv>

      {isMobileView && !isWidgetVisible && (
        <IconButton
          className={classes.widgetButton}
          onClick={toggleWidget}
          onTouchStart={(e) => e.preventDefault()}
          style={{
            position: "fixed",
            bottom: "100px",
            right: "32px",
            zIndex: 1000,
            color: "white",
            backgroundColor: "#0097A7",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            borderRadius: "50%",
            padding: "12px",
          }}
        >
          <AddIcon />
        </IconButton>
      )}
    </StyledDiv>
  );
};

export default HomePage;
