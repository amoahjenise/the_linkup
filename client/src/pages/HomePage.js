import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import FeedSection from "../components/FeedSection";
import WidgetSection from "../components/WidgetSection";
import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";
import { fetchLinkupRequestsSuccess } from "../redux/actions/userSentRequestsActions";
import { getLinkups } from "../api/linkUpAPI";
import { getLinkupRequests } from "../api/linkupRequestAPI";
import { IconButton } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";
import { showNewLinkupButton } from "../redux/actions/linkupActions";
import LoadingSpinner from "../components/LoadingSpinner";

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
    flex: "2",
    overflowY: "auto",
    borderRightWidth: "1px",
    borderRightColor: colorMode === "dark" ? "#2D3748" : "#D3D3D3",
    [theme.breakpoints.down("sm")]: {
      flex: "1",
    },
  },
  [`&.${classes.widgetSection}`]: {
    flex: "1",
    overflowY: "auto",
    display: "block",
    [theme.breakpoints.down("sm")]: {
      position: "fixed",
      top: 0,
      right: 0,
      width: "100%",
      height: "100vh",
      backgroundColor: colorMode === "dark" ? "black" : "white",
      boxShadow: "-2px 0px 5px rgba(0, 0, 0, 0.1)",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      zIndex: 2000,
      overflowY: "auto",
    },
  },
  [`&.${classes.widgetButton}`]: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1100,
    borderRadius: "50%",
    backgroundColor: colorMode === "dark" ? "#2D3748" : "#D3D3D3",
    display: "block",
    [theme.breakpoints.down("sm")]: {
      display: "none", // Hide on small screens
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
    minHeight: "100vh",
  },
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
  const [fetchedLinkupIds, setFetchedLinkupIds] = useState([]);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const totalPages = Math.ceil(linkupList[0]?.total_active_linkups / PAGE_SIZE);
  const { colorMode } = useColorMode();

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

  const fetchLinkupsAndPoll = useCallback(
    async (page) => {
      setIsFetchingNextPage(true);
      try {
        if (!userId || page < 1 || PAGE_SIZE < 1) return; // Validate userId and page values

        const adjustedPage = page - 1; // Adjust page for zero-based indexing
        const sqlOffset = adjustedPage * PAGE_SIZE; // This should be a valid number now

        console.log(
          "Fetching linkups - Page:",
          page,
          "Page Size:",
          PAGE_SIZE,
          "SQL Offset:",
          sqlOffset
        );

        // Fetch linkups from the API
        const response = await getLinkups(
          userId,
          gender,
          0,
          sqlOffset + PAGE_SIZE, // Adjust fetching logic
          latitude,
          longitude
        );

        if (response.success) {
          // Filter only active linkups
          const activeLinkups = response.linkupList.filter(
            (linkup) => linkup.status === "active"
          );

          // Calculate distance for each linkup and set isUserCreated
          const updatedLinkupList = activeLinkups.map((linkup) => ({
            ...linkup,
            isUserCreated: linkup.creator_id === userId, // Check if the current user created the linkup
            createdAtTimestamp: linkup.created_at, // Assign the created_at timestamp
            distance: calculateDistance(
              latitude,
              longitude,
              linkup.latitude,
              linkup.longitude
            ),
          }));

          // Sort the updated list by createdAtTimestamp, then by distance
          updatedLinkupList.sort((a, b) => {
            // Sort by createdAtTimestamp (newest first)
            const createdAtComparison =
              new Date(b.createdAtTimestamp) - new Date(a.createdAtTimestamp);

            if (createdAtComparison !== 0) return createdAtComparison; // If they are different, use this result

            // If createdAt is the same, sort by distance
            return a.distance - b.distance; // Ascending order by distance
          });

          // Dispatch updated linkups to Redux store
          dispatch(fetchLinkupsSuccess(updatedLinkupList));

          // Update state for current page and fetched linkup IDs
          setCurrentPage(page);
          const newFetchedLinkupIds = updatedLinkupList.map(
            (linkup) => linkup.id
          );
          setFetchedLinkupIds([...fetchedLinkupIds, ...newFetchedLinkupIds]);
        } else {
          console.error("Error fetching linkups:", response.message);
        }
      } catch (error) {
        console.error("Error fetching linkups:", error);
      } finally {
        // Ensure fetching state is reset
        setIsFetchingNextPage(false);
        setIsLoading(false); // Set loading to false after fetching
      }
    },
    [dispatch, fetchedLinkupIds, gender, latitude, longitude, userId]
  );

  const handleScroll = useCallback(() => {
    const threshold = 10; // Set threshold for triggering new fetch
    if (
      feedSectionRef.current &&
      feedSectionRef.current.scrollHeight - feedSectionRef.current.scrollTop <=
        feedSectionRef.current.clientHeight + threshold
    ) {
      if (currentPage < totalPages && !isFetchingNextPage) {
        const newPageSize = PAGE_SIZE + (currentPage - 1) * PAGE_SIZE; // Increment the page size
        fetchLinkupsAndPoll(currentPage + 1, newPageSize);
      } else {
        console.log("No more pages to fetch or currently fetching...");
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

    // Check if the scroll container exists before adding the event listener
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);

      // Clean up the event listener when the component unmounts
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  const fetchLinkupRequests = useCallback(async () => {
    try {
      dispatch(showNewLinkupButton(false)); // Dispatch action to show the NewLinkupButton
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
    dispatch(showNewLinkupButton(false)); // Dispatch action to show the NewLinkupButton
    fetchLinkupsAndPoll(1);
    scrollToTop();
  }, [dispatch, fetchLinkupsAndPoll]);

  const scrollToTop = () => {
    if (feedSectionRef.current) {
      feedSectionRef.current.scrollTop = 0;
    }
  };

  const toggleWidget = () => {
    if (window.innerWidth <= 600) {
      setIsWidgetVisible(!isWidgetVisible); // Toggle only for mobile screens
    }
  };

  useEffect(() => {
    // Ensure widget is always visible on desktop and only toggleable on mobile
    const handleResize = () => {
      if (window.innerWidth > 600) {
        setIsWidgetVisible(true); // Always visible on desktop
      } else {
        setIsWidgetVisible(false); // Toggleable on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call initially to set the correct state on load

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />; // Show loading state until userId is available
  }

  return (
    <StyledDiv className={classes.homePage} colorMode={colorMode}>
      <StyledDiv className={classes.feedSection} ref={feedSectionRef}>
        {userId && (
          <FeedSection
            linkupList={linkupList}
            isLoading={isFetchingNextPage}
            setShouldFetchLinkups={setShouldFetchLinkups}
            onRefreshClick={refreshLinkups}
          />
        )}
      </StyledDiv>
      <StyledDiv
        className={`${classes.widgetSection} ${
          isWidgetVisible ? classes.slideIn : classes.slideOut
        }`}
        colorMode={colorMode}
      >
        {window.innerWidth <= 600 && (
          <IconButton
            className={classes.widgetCloseButton}
            onClick={toggleWidget}
          >
            <CloseIcon
              style={{ color: colorMode === "dark" ? "white" : "black" }}
            />
          </IconButton>
        )}
        <WidgetSection
          setShouldFetchLinkups={setShouldFetchLinkups}
          scrollToTopCallback={scrollToTop}
          onRefreshClick={refreshLinkups}
          userId={userId}
          gender={gender}
        />
      </StyledDiv>

      {/* Floating Filter Icon Button */}
      {window.innerWidth <= 600 && (
        <IconButton
          className={classes.widgetButton}
          onClick={toggleWidget}
          style={{
            position: "fixed",
            bottom: "100px",
            right: "32px",
            zIndex: 1000, // Ensure it's on top of other elements
            color: "white",
            backgroundColor: "#0097A7",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Circular shadow effect
            borderRadius: "50%", // Make the button circular
            padding: "12px", // Add padding for a circular look
          }}
        >
          <AddIcon />
        </IconButton>
      )}
    </StyledDiv>
  );
};

export default HomePage;
