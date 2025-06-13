import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";
import debounce from "lodash/debounce";

import { searchLinkups } from "../api/linkUpAPI";
import { useFeed } from "../hooks/useFeed";
import useFilteredFeed from "../hooks/useFilteredFeed";
import { useSentRequests } from "../hooks/useSentRequests";
import { useResponsiveWidget } from "../hooks/useResponsiveWidget";

import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/TopNavBar";
import WidgetSection from "../components/WidgetSection";
import UpdateFeedButton from "../components/UpdateFeedButton";
import SearchInput from "../components/SearchInputWidget";
import VirtualizedFeed from "../components/VirtualizedFeed";
import EmptyFeedPlaceholder from "../components/EmptyFeedPlaceholder";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { filterLinkupsByUserPreferences } from "../utils/linkupFiltering";
import { CircularProgress } from "@mui/material";

const serializeFormData = (data) =>
  JSON.stringify({
    ...data,
    selectedDate: data.selectedDate?.toISOString() ?? null,
  });

const deserializeFormData = (str) => {
  const parsed = JSON.parse(str);
  return {
    ...parsed,
    selectedDate: parsed.selectedDate ? new Date(parsed.selectedDate) : null,
  };
};

function useSessionStorage(key, defaultValue, { serialize, deserialize }) {
  const [state, setState] = useState(() => {
    const saved = sessionStorage.getItem(key);
    return saved ? deserialize(saved) : defaultValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState];
}

function simpleHash(feed) {
  if (!feed || feed.length === 0) return "";

  // Take first 3 and last 3 items for better stability
  const itemsToHash = [...feed.slice(0, 3), ...feed.slice(-3)];

  return itemsToHash
    .map((item) => `${item.id}:${item.updatedAt || ""}`)
    .join("|");
}

const LoadingIndicator = () => (
  <div
    style={{
      padding: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CircularProgress />
  </div>
);

const StyledScrollToTopButton = styled(ScrollToTopButton)(
  ({ theme, $visible }) => ({
    position: "fixed",
    bottom: theme.spacing(10),
    right: theme.spacing(2),
    zIndex: 1000,
    opacity: $visible ? 1 : 0,
    pointerEvents: $visible ? "auto" : "none",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    transform: $visible ? "translateY(0)" : "translateY(20px)",
    "&:hover": {
      transform: $visible ? "translateY(-2px)" : "translateY(20px)",
    },
  })
);

const EndOfFeedIndicator = ({ colorMode }) => (
  <div
    style={{
      padding: "40px 20px",
      textAlign: "center",
      color: colorMode === "dark" ? "#E4E6EB" : "#606770",
      fontSize: "0.9rem",
    }}
  >
    You've reached the end of the feed
  </div>
);

const FeedPageContainer = styled("div")({
  display: "flex",
  width: "100%",
  position: "relative",
  overflow: "hidden",
});

const FeedSection = styled("div", {
  shouldForwardProp: (prop) => prop !== "colorMode",
})(({ theme, colorMode }) => ({
  flex: 2.5,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0px",
    height: "0px",
    background: "transparent",
  },
  [theme.breakpoints.down("md")]: { flex: 2 },
  [theme.breakpoints.down("sm")]: { flex: 1, borderRight: "none" },
}));

const SearchInputContainer = styled("div")(({ theme }) => ({
  top: 0,
  position: "sticky",
  padding: `${theme.spacing(0)} ${theme.spacing(1)}`,
  zIndex: theme.zIndex.appBar,
}));

const WidgetSectionContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "colorMode" && prop !== "isVisible",
})(({ theme, colorMode, isVisible }) => ({
  flex: 1.5,
  overflowY: "auto",
  borderLeft: `1px solid ${colorMode === "dark" ? "#2D3748" : "#D3D3D3"}`,
  paddingBottom: "60px",
  [theme.breakpoints.down("md")]: { flex: 2 },
  [theme.breakpoints.down("sm")]: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "100%",
    height: "100vh",
    backgroundColor: colorMode === "dark" ? "#000" : "#fff",
    boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
    transform: isVisible ? "translateX(0)" : "translateX(100%)",
    transition: "transform 0.3s ease",
    zIndex: 2000,
    paddingTop: "60px",
    paddingBottom: "env(safe-area-inset-bottom, 60px)",
    borderLeft: "none",
  },
}));

const CreateLinkupFloatingButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "isClose",
})(({ theme, isClose, colorMode, opacity }) => ({
  position: "fixed",
  zIndex: 1000,
  opacity,
  transition: "all 0.3s ease-in-out",
  width: isClose ? 50 : 64,
  height: isClose ? 50 : 64,
  ...(isClose
    ? { top: theme.spacing(2), right: theme.spacing(2) }
    : { bottom: theme.spacing(10.5), right: theme.spacing(2.75) }),
  color: colorMode === "dark" ? "#fff" : "#000",
  backgroundColor: isClose
    ? colorMode === "dark"
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.1)"
    : "#0097A7",
  borderRadius: "50%",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    backgroundColor: isClose
      ? colorMode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.2)"
      : "#008394",
    opacity: 1,
    transform: "scale(1.05)",
    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.3)",
  },
  "&:active": {
    transform: "scale(0.95)",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
  },
  padding: isClose ? theme.spacing(1) : theme.spacing(1.5),
}));

export default function FeedPage({ isMobile }) {
  const { colorMode } = useColorMode();
  const loggedUser = useSelector((s) => s.loggedUser.user || {});
  const userSettings = useSelector((s) => s.userSettings.userSettings || {});
  const { id, gender } = loggedUser;

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [buttonOpacity, setButtonOpacity] = useState(1);

  const virtualizedScrollRef = useRef(null);
  const isRestoringScroll = useRef(false);

  const [linkupFormData, setLinkupFormData] = useSessionStorage(
    "linkupFormData",
    {
      activity: "",
      location: "",
      selectedDate: null,
      genderPreference: [],
      paymentOption: null,
      formErrors: {},
      isLoading: false,
    },
    { serialize: serializeFormData, deserialize: deserializeFormData }
  );

  const {
    rawFeed,
    hasMore,
    loading,
    setPage,
    addLinkup,
    updateLinkup,
    removeLinkup,
    reload,
    hasLoadedOnce,
  } = useFeed(id, gender, {
    latitude: loggedUser.latitude,
    longitude: loggedUser.longitude,
  });

  const filteredFeed = useFilteredFeed(rawFeed, id);
  const { sentRequests } = useSentRequests(id);

  const { isMobileView, isWidgetVisible, toggleWidget } = useResponsiveWidget();

  const showUpdateFeedButton = useSelector(
    (s) => s.linkups.showUpdateFeedButton
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const isSearching = Boolean(searchQuery.trim());

  const debounceTime = isMobile ? 500 : 300;
  const debouncedSearch = useMemo(
    () =>
      debounce(async (q) => {
        if (!q.trim()) {
          setSearchResults([]);
          setSearchLoading(false);
          return;
        }
        try {
          const { linkupList = [] } = await searchLinkups(q, id, gender);
          setSearchResults(
            filterLinkupsByUserPreferences(linkupList, id, userSettings)
          );
        } catch {
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, debounceTime),
    [id, gender, userSettings, debounceTime]
  );

  const handleSearchChange = useCallback(
    (e) => {
      const q = e.target.value;
      setSearchQuery(q);
      setSearchLoading(Boolean(q.trim()));
      debouncedSearch(q);
    },
    [debouncedSearch]
  );

  const latestFeedRef = useRef(filteredFeed);
  useEffect(() => {
    latestFeedRef.current = filteredFeed;
  }, [filteredFeed]);

  const debouncedSaveScrollPosition = useMemo(() => {
    return debounce(() => {
      if (virtualizedScrollRef.current && !isRestoringScroll.current) {
        const scrollPosition = virtualizedScrollRef.current.getScrollPosition();
        const firstItem = latestFeedRef.current[0];
        const state = virtualizedScrollRef.current.getState?.();

        sessionStorage.setItem(
          "feedScrollData",
          JSON.stringify({
            position: scrollPosition,
            feedLength: latestFeedRef.current.length,
            feedVersion: firstItem?.updatedAt || firstItem?.id,
            feedHash: simpleHash(latestFeedRef.current),
            scrollDirection: state?.scrollDirection,
          })
        );
      }
    }, 500);
  }, []);

  const scrollToTop = useCallback(() => {
    if (virtualizedScrollRef.current) {
      virtualizedScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const scrollPosition =
      virtualizedScrollRef.current?.getScrollPosition() ?? 0;

    console.log("Scroll position:", scrollPosition); // ✅ Add this line

    if (!isRestoringScroll.current) {
      debouncedSaveScrollPosition();
    }

    setShowScrollTop(scrollPosition > 300);
    setButtonOpacity(Math.max(0.4, 1 - Math.min(scrollPosition, 200) / 200));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const scrollElement = virtualizedScrollRef.current?.getScrollElement?.();
      if (scrollElement) {
        scrollElement.addEventListener("scroll", handleScroll, {
          passive: true,
        });
        clearInterval(interval); // cleanup interval after attaching
      }
    }, 100); // retry every 100ms

    return () => {
      const scrollElement = virtualizedScrollRef.current?.getScrollElement?.();
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
      clearInterval(interval);
      debouncedSaveScrollPosition.cancel();
    };
  }, [handleScroll]);

  useEffect(() => {
    if (isSearching) {
      sessionStorage.removeItem("feedScrollData");
    }
  }, [isSearching]);

  useEffect(() => {
    return () => {
      if (virtualizedScrollRef.current) {
        const scrollPosition = virtualizedScrollRef.current.getScrollPosition();
        const firstItem = latestFeedRef.current[0];
        const state = virtualizedScrollRef.current.getState?.();

        sessionStorage.setItem(
          "feedScrollData",
          JSON.stringify({
            position: scrollPosition,
            feedLength: latestFeedRef.current.length,
            feedVersion: firstItem?.updatedAt || firstItem?.id,
            feedHash: simpleHash(latestFeedRef.current),
            scrollDirection: state?.scrollDirection,
          })
        );
      }

      isRestoringScroll.current = false;
      debouncedSaveScrollPosition.cancel();
    };
  }, []);

  useEffect(() => {
    if (
      !loading &&
      filteredFeed.length > 0 &&
      hasLoadedOnce &&
      virtualizedScrollRef.current?.isReady?.()
    ) {
      const savedData = sessionStorage.getItem("feedScrollData");
      if (!savedData) return;

      try {
        const { position, feedLength, feedVersion, feedHash } =
          JSON.parse(savedData);
        const currentFirstItem = filteredFeed[0];

        // Enhanced comparison logic
        const isSameFeedVersion =
          feedVersion === currentFirstItem?.updatedAt ||
          feedVersion === currentFirstItem?.id;

        const isSimilarFeed = Math.abs(filteredFeed.length - feedLength) < 20; // remove hash check entirely

        const shouldRestore =
          position > 0 && !isSearching && (isSameFeedVersion || isSimilarFeed);

        if (shouldRestore) {
          isRestoringScroll.current = true;
          virtualizedScrollRef.current.scrollTo({ top: position });

          // Add a scroll event listener to reset the flag after restoration
          const scrollElement = virtualizedScrollRef.current.getScrollElement();
          const handleScrollAfterRestore = () => {
            isRestoringScroll.current = false;
            scrollElement.removeEventListener(
              "scroll",
              handleScrollAfterRestore
            );
          };

          scrollElement.addEventListener("scroll", handleScrollAfterRestore, {
            passive: true,
            once: true,
          });

          // Fallback in case scroll event doesn't fire
          const timeout = setTimeout(() => {
            isRestoringScroll.current = false;
          }, 500);

          return () => clearTimeout(timeout);
        }
      } catch (e) {
        console.error("Failed to restore scroll position", e);
      }
    }
  }, [loading, filteredFeed, hasLoadedOnce, isSearching]);

  const handleUpdateFeed = useCallback(() => {
    reload();
    scrollToTop();
  }, [reload, scrollToTop]);

  const loadMoreLinkups = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading, setPage]);

  const linkupsToShow = isSearching ? searchResults : filteredFeed;

  return (
    <>
      <FeedPageContainer>
        <FeedSection colorMode={colorMode} data-testid="feed-section">
          <TopNavBar title="Home" />
          <SearchInputContainer>
            <SearchInput
              handleInputChange={handleSearchChange}
              loading={searchLoading}
              value={searchQuery}
            />
          </SearchInputContainer>
          {showUpdateFeedButton && (
            <UpdateFeedButton
              refreshFeed={handleUpdateFeed}
              colorMode={colorMode}
            />
          )}

          {loading && !hasLoadedOnce ? (
            <LoadingSpinner />
          ) : linkupsToShow.length === 0 ? (
            <EmptyFeedPlaceholder isMobile={isMobile} />
          ) : (
            <VirtualizedFeed
              ref={virtualizedScrollRef}
              linkups={linkupsToShow}
              loadMore={loadMoreLinkups}
              loading={loading}
              hasMore={hasMore}
              colorMode={colorMode}
              addLinkup={addLinkup}
              updateLinkup={updateLinkup}
              removeLinkup={removeLinkup}
              handleScrollToTop={scrollToTop}
              loggedUser={loggedUser}
              sentRequests={sentRequests}
            />
          )}
          {loading && hasLoadedOnce && <LoadingIndicator />}
          {/* {!hasMore && hasLoadedOnce && (
            <EndOfFeedIndicator colorMode={colorMode} />
          )} */}
          <StyledScrollToTopButton
            onClick={scrollToTop}
            colorMode={colorMode}
            $visible={showScrollTop}
          />
        </FeedSection>
        <WidgetSectionContainer
          colorMode={colorMode}
          isVisible={isWidgetVisible}
        >
          {isMobileView && (
            <CreateLinkupFloatingButton
              onClick={toggleWidget}
              isClose
              colorMode={colorMode}
              opacity={buttonOpacity}
            >
              <CloseIcon fontSize="small" />
            </CreateLinkupFloatingButton>
          )}
          <WidgetSection
            toggleWidget={toggleWidget}
            isMobile={isMobile}
            addLinkup={addLinkup}
            handleScrollToTop={scrollToTop}
            linkupFormData={linkupFormData}
            updateLinkupForm={(f, v) =>
              setLinkupFormData((p) => ({ ...p, [f]: v }))
            }
          />
        </WidgetSectionContainer>

        {isMobileView && !isWidgetVisible && (
          <CreateLinkupFloatingButton
            onClick={toggleWidget}
            isClose={false}
            colorMode={colorMode}
            opacity={buttonOpacity}
          >
            <AddIcon />
          </CreateLinkupFloatingButton>
        )}
      </FeedPageContainer>
    </>
  );
}
