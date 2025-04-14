import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";
import { debounce } from "lodash";
import FeedSection from "../components/FeedSection";
import WidgetSection from "../components/WidgetSection";
import { mergeLinkupsSuccess } from "../redux/actions/linkupActions";
import { fetchLinkupRequestsSuccess } from "../redux/actions/userSentRequestsActions";
import { getLinkups } from "../api/linkUpAPI";
import { getLinkupRequests } from "../api/linkupRequestAPI";
import { showNewLinkupButton } from "../redux/actions/linkupActions";
import LoadingSpinner from "../components/LoadingSpinner";
import useLocationUpdate from "../hooks/useLocationUpdate";

const PAGE_SIZE = 20;

const StyledDiv = styled("div")(({ theme, colorMode }) => ({
  [`&.homePage`]: {
    display: "flex",
    width: "100%",
    position: "relative",
  },
  [`&.feedSection`]: {
    flex: "2.5",
    overflowY: "auto",
    borderRightColor: colorMode === "dark" ? "#2D3748" : "#D3D3D3",
    [theme.breakpoints.down("md")]: { flex: "2" },
    [theme.breakpoints.down("sm")]: { flex: "1" },
  },
  [`&.widgetSection`]: {
    flex: "1.5",
    overflowY: "auto",
    display: "block",
    transition: "width 0.3s ease",
    borderLeftWidth: "1px",
    [theme.breakpoints.down("md")]: { flex: "2" },
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
  [`&.slideIn`]: { transform: "translateX(0)" },
  [`&.slideOut`]: { transform: "translateX(100%)" },
}));

const HomePage = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const feedSectionRef = useRef(null);
  const wasManuallyToggled = useRef(false);

  // Memoized selectors
  const loggedUser = useSelector((state) => state.loggedUser);
  const linkupList = useSelector((state) => state.linkups.linkupList);
  const userId = loggedUser.user.id;
  const userData = useMemo(
    () => ({
      gender: loggedUser.user.gender,
      latitude: loggedUser.user.latitude,
      longitude: loggedUser.user.longitude,
    }),
    [
      loggedUser.user.gender,
      loggedUser.user.latitude,
      loggedUser.user.longitude,
    ]
  );

  // State
  const [state, setState] = useState({
    currentPage: 1,
    isFetchingNextPage: false,
    shouldFetchLinkups: true,
    fetchedLinkupIds: [],
    isWidgetVisible: !(window.innerWidth <= 600),
    isLoading: true,
    isMobileView: window.innerWidth <= 600,
  });

  // Derived values
  const totalPages = useMemo(
    () => Math.ceil(linkupList[0]?.total_active_linkups / PAGE_SIZE),
    [linkupList]
  );

  useLocationUpdate();

  // Corrected calculateDistance function
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  const fetchLinkupsAndPoll = useCallback(
    async (page) => {
      setState((prev) => ({ ...prev, isFetchingNextPage: true }));
      try {
        const adjustedPage = page - 1;
        const sqlOffset = adjustedPage * PAGE_SIZE;

        const response = await getLinkups(
          userId,
          userData.gender,
          0,
          sqlOffset + PAGE_SIZE,
          userData.latitude,
          userData.longitude
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
              userData.latitude,
              userData.longitude,
              linkup.latitude,
              linkup.longitude
            ),
          }));

          updatedLinkupList.sort((a, b) => {
            const createdAtComparison =
              new Date(b.createdAtTimestamp) - new Date(a.createdAtTimestamp);
            return createdAtComparison !== 0
              ? createdAtComparison
              : a.distance - b.distance;
          });

          dispatch(mergeLinkupsSuccess(updatedLinkupList, page === 1));

          setState((prev) => ({
            ...prev,
            currentPage: page,
            fetchedLinkupIds: [
              ...new Set([
                ...prev.fetchedLinkupIds,
                ...updatedLinkupList.map((linkup) => linkup.id),
              ]),
            ],
          }));
        }
      } finally {
        setState((prev) => ({
          ...prev,
          isFetchingNextPage: false,
          isLoading: false,
        }));
      }
    },
    [userId, userData, calculateDistance, dispatch]
  );

  const handleScroll = useCallback(() => {
    const threshold = 20;
    const { scrollHeight, scrollTop, clientHeight } =
      feedSectionRef.current || {};

    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      if (state.currentPage < totalPages && !state.isFetchingNextPage) {
        const scrollData = {
          top: scrollTop,
          height: scrollHeight,
        };

        fetchLinkupsAndPoll(state.currentPage + 1).then(() => {
          if (feedSectionRef.current) {
            const newScrollHeight = feedSectionRef.current.scrollHeight;
            feedSectionRef.current.scrollTop =
              scrollData.top + (newScrollHeight - scrollData.height);
          }
        });
      }
    }
  }, [
    state.currentPage,
    state.isFetchingNextPage,
    totalPages,
    fetchLinkupsAndPoll,
  ]);

  // Effects
  useEffect(() => {
    if (userId && state.shouldFetchLinkups) {
      fetchLinkupsAndPoll(1);
      setState((prev) => ({ ...prev, shouldFetchLinkups: false }));
    }
  }, [userId, state.shouldFetchLinkups, fetchLinkupsAndPoll]);

  useEffect(() => {
    const scrollContainer = feedSectionRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
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
    return new Promise((resolve) => {
      if (!state.isLoading && !state.isFetchingNextPage) {
        setState((prev) => ({ ...prev, isLoading: true }));
      }

      dispatch(showNewLinkupButton(false));

      setTimeout(() => {
        fetchLinkupsAndPoll(1).finally(() => {
          setState((prev) => ({ ...prev, isLoading: false }));
          scrollToTop();
          resolve();
        });
      }, 100);
    });
  }, [
    state.isLoading,
    state.isFetchingNextPage,
    dispatch,
    fetchLinkupsAndPoll,
  ]);

  const scrollToTop = useCallback(() => {
    if (feedSectionRef.current) {
      feedSectionRef.current.scrollTop = 0;
    }
  }, []);

  const toggleWidget = useCallback(() => {
    wasManuallyToggled.current = true;
    setState((prev) => ({ ...prev, isWidgetVisible: !prev.isWidgetVisible }));
  }, []);

  const handleResize = useCallback(() => {
    const newIsMobile = window.innerWidth <= 600;
    if (state.isMobileView !== newIsMobile) {
      setState((prev) => ({
        ...prev,
        isMobileView: newIsMobile,
        isWidgetVisible: wasManuallyToggled.current
          ? prev.isWidgetVisible
          : !newIsMobile,
      }));
    }
  }, [state.isMobileView]);

  useEffect(() => {
    const debouncedHandleResize = debounce(handleResize, 100);
    window.addEventListener("resize", debouncedHandleResize);
    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, [handleResize]);

  if (state.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <StyledDiv className="homePage" colorMode={colorMode}>
      <StyledDiv className="feedSection" ref={feedSectionRef}>
        {userId && (
          <FeedSection
            linkupList={linkupList}
            isLoading={state.isLoading}
            setIsLoading={(loading) =>
              setState((prev) => ({ ...prev, isLoading: loading }))
            }
            setShouldFetchLinkups={(fetch) =>
              setState((prev) => ({ ...prev, shouldFetchLinkups: fetch }))
            }
            onRefreshClick={refreshLinkups}
            userId={userId}
            gender={userData.gender}
            feedRef={feedSectionRef}
            colorMode={colorMode}
            isMobile={isMobile}
          />
        )}
      </StyledDiv>

      <StyledDiv
        className={`widgetSection ${
          state.isWidgetVisible ? "slideIn" : "slideOut"
        }`}
        colorMode={colorMode}
      >
        {state.isMobileView && (
          <IconButton
            sx={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 1100,
            }}
            onClick={toggleWidget}
          >
            <CloseIcon
              sx={{ color: colorMode === "dark" ? "white" : "black" }}
            />
          </IconButton>
        )}
        <WidgetSection
          toggleWidget={toggleWidget}
          setShouldFetchLinkups={(fetch) =>
            setState((prev) => ({ ...prev, shouldFetchLinkups: fetch }))
          }
          scrollToTopCallback={scrollToTop}
          isMobile={state.isMobileView}
        />
      </StyledDiv>

      {state.isMobileView && !state.isWidgetVisible && (
        <IconButton
          sx={{
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
          onClick={toggleWidget}
        >
          <AddIcon />
        </IconButton>
      )}
    </StyledDiv>
  );
};

export default HomePage;
