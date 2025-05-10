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
import { IconButton } from "@mui/material";
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
import { ArrowUpward } from "@mui/icons-material";
import ScrollToTopButton from "../components/ScrollToTopButton";

// Dynamically import Feed component
const Feed = lazy(() => import("../components/Feed")); // Lazy load Feed

// Styled Components
const FeedPageContainer = styled("div")({
  display: "flex",
  width: "100%",
  position: "relative",
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

const CreateLinkupFloatingButton = ({ onClick, isClose, colorMode }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "fixed",
      width: isClose ? "50px" : "64px", // Smaller width for close
      height: isClose ? "50px" : "64px", // Smaller height for close
      zIndex: 1000,
      ...(isClose
        ? { top: "16px", right: "16px" }
        : { bottom: "85px", right: "22px" }),
      color: colorMode === "dark" ? "white" : "black",
      backgroundColor: isClose
        ? colorMode === "dark"
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.1)"
        : "#0097A7",
      "&:hover": {
        backgroundColor: isClose
          ? colorMode === "dark"
            ? "rgba(255,255,255,0.2)"
            : "rgba(0,0,0,0.2)"
          : "#008394",
      },
      borderRadius: "50%",
      p: isClose ? 1 : 1.5, // Slightly smaller padding for the close button
    }}
  >
    {isClose ? <CloseIcon fontSize="small" /> : <AddIcon />}
  </IconButton>
);

const FeedPage = ({ isMobile }) => {
  const { colorMode } = useColorMode();
  const loggedUser = useSelector((state) => state.loggedUser?.user || {});
  const userSettings = useSelector(
    (state) => state.userSettings?.userSettings || {}
  );

  // Initialize form data from sessionStorage or default values
const [linkupFormData, setLinkupFormData] = useState(() => {
  const savedFormData = sessionStorage.getItem("linkupFormData");
  return savedFormData
    ? JSON.parse(savedFormData)
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
    sessionStorage.setItem("linkupFormData", JSON.stringify(linkupFormData));
  }, [linkupFormData]);

  // Search query states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query) => {
        if (!query.trim()) {
          setSearchResults([]);
          setIsSearching(false);
          return;
        }

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
          setIsSearching(true);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 300),
    [id, gender, userSettings]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  // Store and restore the scroll position
  useEffect(() => {
    if (!loading && filteredFeed.length > 0 && feedRef.current) {
      const savedScroll = sessionStorage.getItem("feedScrollPosition");
      if (savedScroll !== null) {
        feedRef.current.scrollTop = parseInt(savedScroll, 10);
      }
    }
  }, [loading, filteredFeed]);

  // Save the scroll position on scroll
  const handleScroll = () => {
    if (feedRef.current) {
      const scrollTop = feedRef.current.scrollTop;
      sessionStorage.setItem("feedScrollPosition", scrollTop);
      setShowScrollTop(scrollTop > 300); // Show button after 300px
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

  if (loading) return <LoadingSpinner />;

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
      </FeedSection>

      <WidgetSectionContainer colorMode={colorMode} isVisible={isWidgetVisible}>
        {isMobileView && (
          <CreateLinkupFloatingButton
            onClick={toggleWidget}
            isClose
            colorMode={colorMode}
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
        />
      )}
    </FeedPageContainer>
  );
};

export default FeedPage;
