import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import { searchLinkups } from "../api/linkUpAPI";
import { useFeed } from "../hooks/useFeed";
import useFilteredFeed from "../hooks/useFilteredFeed";
import { useSentRequests } from "../hooks/useSentRequests";
import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/TopNavBar";
import WidgetSection from "../components/WidgetSection";
import { styled } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";
import { Suspense, lazy } from "react";
import { useResponsiveWidget } from "../hooks/useResponsiveWidget";
import UpdateFeedButton from "../components/UpdateFeedButton";
import SearchInput from "../components/SearchInputWidget";
import debounce from "lodash/debounce";
import FeedItem from "../components/FeedItem";
import EmptyFeedPlaceholder from "../components/EmptyFeedPlaceholder";
import { filterLinkupsByUserPreferences } from "../utils/linkupFiltering"; // <-- Create this utility
import ScrollToTopButton from "../components/ScrollToTopButton";
import PullToRefresh from "react-pull-to-refresh";

// Dynamically import Feed component
const Feed = lazy(() => import("../components/Feed")); // Lazy load Feed

// Styled Components
const FeedPageContainer = styled("div")({
  display: "flex",
  width: "100%",
  position: "relative",
  overflow: "hidden",
});

const FeedSection = styled("div")(({ theme, colorMode }) => ({
  flex: "2.5",
  overflowY: "auto",
  borderRight: `1px solid ${colorMode === "dark" ? "#2D3748" : "#D3D3D3"}`,
  [theme.breakpoints.down("md")]: { flex: "2" },
  [theme.breakpoints.down("sm")]: { flex: "1", borderRight: "none" },
}));

const SearchInputContainer = styled("div")(({ theme }) => ({
  padding: 8,
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar,
  backgroundColor: "background.paper",
}));

const WidgetSectionContainer = styled("div")(
  ({ theme, colorMode, isVisible }) => ({
    flex: "1.5",
    overflowY: "auto",
    borderLeft: `1px solid ${colorMode === "dark" ? "#2D3748" : "#D3D3D3"}`,
    paddingBottom: "60px",
    [theme.breakpoints.down("md")]: { flex: "2" },
    [theme.breakpoints.down("sm")]: {
      position: "fixed",
      top: 0,
      right: 0,
      width: "100%",
      height: "100vh",
      backgroundColor: colorMode === "dark" ? "black" : "white",
      boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
      transform: isVisible ? "translateX(0)" : "translateX(100%)",
      transition: "transform 0.3s ease",
      zIndex: 2000,
      paddingTop: "60px",
      paddingBottom: "env(safe-area-inset-bottom, 60px)",
      borderLeft: "none",
    },
  })
);

const CreateLinkupFloatingButton = ({
  onClick,
  isClose,
  colorMode,
  opacity = 1,
}) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "fixed",
      width: isClose ? "50px" : "64px",
      height: isClose ? "50px" : "64px",
      zIndex: 1000,
      opacity,
      transition: "all 0.3s ease-in-out",
      ...(isClose
        ? { top: "16px", right: "16px" }
        : { bottom: "85px", right: "22px" }),
      color: colorMode === "dark" ? "white" : "black",
      backgroundColor: isClose
        ? colorMode === "dark"
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.1)"
        : "#0097A7",
      borderRadius: "50%",
      p: isClose ? 1 : 1.5,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // adds depth by default
      "&:hover": {
        backgroundColor: isClose
          ? colorMode === "dark"
            ? "rgba(255,255,255,0.2)"
            : "rgba(0,0,0,0.2)"
          : "#008394",
        opacity: 1, // make it fully visible
        transform: "scale(1.05)", // slight grow effect
        boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.3)", // stronger shadow on hover
      },
      "&:active": {
        transform: "scale(0.95)", // subtle press-down effect
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)", // pressed shadow
      },
    }}
  >
    {isClose ? <CloseIcon fontSize="small" /> : <AddIcon />}
  </IconButton>
);

const FeedWrapper = styled(Box)(({ theme }) => ({
  display: "grid",
  // gap: theme.spacing(2),
  // padding: theme.spacing(2),
  "@media (max-width: 900px)": {
    paddingBottom: "65px", // Add padding for footer
  },
}));

const FeedPage = ({ isMobile }) => {
  const { colorMode } = useColorMode();
  const loggedUser = useSelector((state) => state.loggedUser?.user || {});
  const userSettings = useSelector(
    (state) => state.userSettings?.userSettings || {}
  );

  // In FeedPage.js
  const serializeFormData = (data) => {
    return JSON.stringify({
      ...data,
      selectedDate: data.selectedDate ? data.selectedDate.toISOString() : null,
    });
  };

  const deserializeFormData = (str) => {
    const parsed = JSON.parse(str);
    return {
      ...parsed,
      selectedDate: parsed.selectedDate ? new Date(parsed.selectedDate) : null,
    };
  };

  // Initialize form data from sessionStorage or default values
  const [linkupFormData, setLinkupFormData] = useState(() => {
    const savedFormData = sessionStorage.getItem("linkupFormData");
    return savedFormData
      ? deserializeFormData(savedFormData)
      : {
          activity: "",
          location: "",
          selectedDate: null,
          genderPreference: [],
          paymentOption: null,
          formErrors: {},
          isLoading: false,
        };
  });

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("linkupFormData", serializeFormData(linkupFormData));
  }, [linkupFormData]);

  // Search query states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [buttonOpacity, setButtonOpacity] = useState(1);

  // Scroll to top state
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { id, gender, latitude, longitude } = loggedUser;

  // Other feed and search related hooks
  const {
    rawFeed,
    hasMore,
    loading,
    setPage,
    useDistance,
    addLinkup,
    updateLinkup,
    removeLinkup,
    reload,
  } = useFeed(loggedUser.id, loggedUser.gender, {
    latitude: loggedUser.latitude,
    longitude: loggedUser.longitude,
  });

  const filteredFeed = useFilteredFeed(rawFeed, id);

  const { sentRequests, loading: requestLoading } = useSentRequests(id);

  const { isMobileView, isWidgetVisible, toggleWidget } = useResponsiveWidget();

  const isUpdateFeedButtonVisible = useSelector(
    (state) => state.linkups.showUpdateFeedButton
  );

  const feedRef = useRef(null);
  const observer = useRef();

  const updateLinkupForm = (field, value) => {
    setLinkupFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const debounceTime = isMobile ? 500 : 300;

  // Update the debouncedSearch memo to include dependencies
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query) => {
        if (!query.trim()) {
          setSearchResults([]);
          setIsSearching(false);
          return;
        }

        setIsSearching(true); // <-- Add this
        try {
          setSearchLoading(true);
          const response = await searchLinkups(query, id, gender);

          const rawResults = response.linkupList || [];
          const filteredResults = filterLinkupsByUserPreferences(
            rawResults,
            id,
            userSettings
          );

          setSearchResults(filteredResults);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, debounceTime),
    [id, gender, userSettings, debounceTime] // <-- Add dependencies
  );

  // Update the handleSearchChange function
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      setIsSearching(true); // <-- Add this
      setSearchLoading(true);
    } else {
      setIsSearching(false);
      setSearchResults([]);
      setSearchLoading(false);
    }

    debouncedSearch(query);
  };

  // Store and restore the scroll position
  useEffect(() => {
    if (!loading && filteredFeed.length > 0 && feedRef.current) {
      const savedScroll = sessionStorage.getItem("feedScrollPosition");
      if (savedScroll !== null) {
        // Delay scroll restore until DOM is updated
        requestAnimationFrame(() => {
          feedRef.current.scrollTop = parseInt(savedScroll, 10);
        });
      }
    }
  }, [loading, filteredFeed.length]); // track length instead of full array

  // Save the scroll position on scroll
  const handleScroll = () => {
    if (feedRef.current) {
      const scrollTop = feedRef.current.scrollTop;

      // Store scroll position
      sessionStorage.setItem("feedScrollPosition", scrollTop);
      setShowScrollTop(scrollTop > 300);

      // Fade out the button between 0px and 200px scroll
      const maxScroll = 200;
      const newOpacity = Math.max(0.4, 1 - scrollTop / maxScroll);
      setButtonOpacity(newOpacity);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (feedRef.current) {
        sessionStorage.setItem("feedScrollPosition", 0);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Set up the intersection observer for the last item
  const lastItemRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleScrollToTop = () => {
    if (feedRef.current) {
      feedRef.current.scrollTo({
        top: 0,
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  const handleUpdateFeed = () => {
    reload();
    handleScrollToTop();
  };

  return (
    <FeedPageContainer>
      <FeedSection ref={feedRef} onScroll={handleScroll} colorMode={colorMode}>
        <TopNavBar title="Home" />
        <SearchInputContainer>
          <SearchInput
            handleInputChange={handleSearchChange}
            loading={searchLoading}
            value={searchQuery}
          />
        </SearchInputContainer>

        <PullToRefresh onRefresh={reload} style={{ height: "100%" }}>
          {isUpdateFeedButtonVisible && (
            <UpdateFeedButton
              refreshFeed={handleUpdateFeed}
              colorMode={colorMode}
            />
          )}

          {showScrollTop && (
            <ScrollToTopButton
              onClick={handleScrollToTop}
              colorMode={colorMode}
            />
          )}

          {loading ? (
            <LoadingSpinner />
          ) : isSearching ? (
            searchResults.length > 0 ? (
              searchResults.map((linkup) => (
                <FeedWrapper>
                  <FeedItem
                    linkup={linkup}
                    colorMode={colorMode}
                    addLinkup={addLinkup}
                    updateLinkup={updateLinkup}
                    removeLinkup={removeLinkup}
                    useDistance={useDistance}
                    handleScrollToTop={handleScrollToTop}
                    loggedUser={loggedUser}
                    sentRequests={sentRequests}
                  />
                </FeedWrapper>
              ))
            ) : (
              <EmptyFeedPlaceholder message="No matching linkups found" />
            )
          ) : filteredFeed.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <Feed
                linkups={filteredFeed}
                loading={loading}
                hasMore={hasMore}
                setPage={setPage}
                colorMode={colorMode}
                lastItemRef={lastItemRef}
                addLinkup={addLinkup}
                updateLinkup={updateLinkup}
                removeLinkup={removeLinkup}
                useDistance={useDistance}
                handleScrollToTop={handleScrollToTop}
                loggedUser={loggedUser}
                sentRequests={sentRequests}
              />
            </Suspense>
          )}
        </PullToRefresh>
      </FeedSection>

      <WidgetSectionContainer colorMode={colorMode} isVisible={isWidgetVisible}>
        {isMobileView && (
          <CreateLinkupFloatingButton
            onClick={toggleWidget}
            isClose
            colorMode={colorMode}
            opacity={buttonOpacity}
          />
        )}
        <WidgetSection
          toggleWidget={toggleWidget}
          isMobile={isMobile}
          addLinkup={addLinkup}
          handleScrollToTop={handleScrollToTop}
          linkupFormData={linkupFormData}
          updateLinkupForm={updateLinkupForm}
        />
      </WidgetSectionContainer>

      {isMobileView && !isWidgetVisible && (
        <CreateLinkupFloatingButton
          onClick={toggleWidget}
          isClose={false}
          colorMode={colorMode}
          opacity={buttonOpacity}
        />
      )}
    </FeedPageContainer>
  );
};

export default FeedPage;
