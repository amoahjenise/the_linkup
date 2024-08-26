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
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";
import { showNewLinkupButton } from "../redux/actions/linkupActions";

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
    borderRightColor: colorMode === "dark" ? "#2D3748" : "#D3D3D3", // Adjust border color based on mode
    [theme.breakpoints.down("sm")]: {
      flex: "1",
    },
  },
  [`&.${classes.widgetSection}`]: {
    flex: "1",
    overflowY: "auto",
    overflowX: "hidden",
    display: "block", // Make sure it's displayed by default

    [theme.breakpoints.down("sm")]: {
      position: "fixed",
      top: 0,
      right: 0,
      width: "100%",
      height: "100vh",
      backgroundColor: colorMode === "dark" ? "#1A202C" : "white", // Use Chakra's dark mode color
      boxShadow: "-2px 0px 5px rgba(0, 0, 0, 0.1)",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      zIndex: 2000,
      overflowY: "auto",
    },
  },
  [`&.${classes.widgetButton}`]: {
    position: "absolute",
    top: "20px",
    right: "20px",
    zIndex: 1100,
  },
  [`&.${classes.widgetCloseButton}`]: {
    position: "absolute",
    top: "10px",
    left: "10px", // Position close button on the right side
    zIndex: 1100,
    color: colorMode === "dark" ? "white" : "black", // Adjust color based on mode
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
  const totalPages = Math.ceil(linkupList[0]?.total_active_linkups / PAGE_SIZE);
  const { colorMode } = useColorMode();

  const fetchLinkupsAndPoll = useCallback(
    async (page) => {
      setIsFetchingNextPage(true);
      try {
        if (!userId) return;

        const adjustedPage = page - 1;
        const sqlOffset = adjustedPage * PAGE_SIZE;

        // Fetch linkups from the API
        const response = await getLinkups(
          userId,
          gender,
          sqlOffset,
          PAGE_SIZE,
          latitude,
          longitude
        );

        if (response.success) {
          // Filter only active linkups
          const activeLinkups = response.linkupList.filter(
            (linkup) => linkup.status === "active"
          );

          // Update the linkup list based on whether it's the first page or subsequent pages
          const updatedLinkupList =
            page === 1 ? activeLinkups : [...linkupList, ...activeLinkups];

          // Filter out any old linkups and update only with newer data
          const newLinkups = activeLinkups.filter(
            (newLinkup) =>
              !fetchedLinkupIds.includes(newLinkup.id) ||
              updatedLinkupList.some(
                (existingLinkup) =>
                  existingLinkup.id === newLinkup.id &&
                  new Date(newLinkup.updated_at) >
                    new Date(existingLinkup.updated_at)
              )
          );

          // Sort the updated list by creation date, descending
          updatedLinkupList.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          // Dispatch updated linkups to Redux store
          dispatch(fetchLinkupsSuccess(updatedLinkupList));

          // Update state for current page and fetched linkup IDs
          setCurrentPage(page);
          const newFetchedLinkupIds = newLinkups.map((linkup) => linkup.id);
          setFetchedLinkupIds([...fetchedLinkupIds, ...newFetchedLinkupIds]);
        } else {
          console.error("Error fetching linkups:", response.message);
        }
      } catch (error) {
        console.error("Error fetching linkups:", error);
      } finally {
        // Ensure fetching state is reset
        setIsFetchingNextPage(false);
      }
    },
    [
      dispatch,
      fetchedLinkupIds,
      gender,
      latitude,
      linkupList,
      longitude,
      userId,
    ]
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
    setIsWidgetVisible(!isWidgetVisible);
  };

  return (
    <StyledDiv className={classes.homePage} colorMode={colorMode}>
      <StyledDiv className={classes.feedSection} ref={feedSectionRef}>
        <FeedSection
          linkupList={linkupList}
          isLoading={isFetchingNextPage}
          setShouldFetchLinkups={setShouldFetchLinkups}
          onRefreshClick={refreshLinkups}
        />
      </StyledDiv>
      {!isMobile && (
        <StyledDiv className={classes.widgetSection} colorMode={colorMode}>
          <WidgetSection
            setShouldFetchLinkups={setShouldFetchLinkups}
            scrollToTopCallback={scrollToTop}
            onRefreshClick={refreshLinkups}
            userId={userId}
            gender={gender}
          />
        </StyledDiv>
      )}
      {isMobile && (
        <>
          <IconButton
            className={classes.widgetButton}
            onClick={toggleWidget}
            color="primary"
          >
            <MenuIcon />
          </IconButton>
          <StyledDiv
            className={`${classes.widgetSection} ${
              isWidgetVisible ? classes.slideIn : classes.slideOut
            }`}
            colorMode={colorMode}
          >
            <IconButton
              className={classes.widgetCloseButton}
              onClick={toggleWidget}
            >
              <CloseIcon />
            </IconButton>
            <WidgetSection
              setShouldFetchLinkups={setShouldFetchLinkups}
              scrollToTopCallback={scrollToTop}
              onRefreshClick={refreshLinkups}
              userId={userId}
              gender={gender}
            />
          </StyledDiv>
        </>
      )}
    </StyledDiv>
  );
};

export default HomePage;
