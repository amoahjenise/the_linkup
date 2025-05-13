import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
  Suspense,
  lazy,
} from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";
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
import FeedItem from "../components/FeedItem";
import EmptyFeedPlaceholder from "../components/EmptyFeedPlaceholder";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { filterLinkupsByUserPreferences } from "../utils/linkupFiltering";

const Feed = lazy(() => import("../components/Feed"));

// Helpers for sessionStorage persistence
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

// Custom hook to sync state with sessionStorage
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

const FeedPageContainer = styled("div")({
  display: "flex",
  width: "100%",
  position: "relative",
  overflow: "hidden",
});

const FeedSection = styled("div")(({ theme, colorMode }) => ({
  flex: 2.5,
  overflowY: "auto",
  borderRight: `1px solid ${colorMode === "dark" ? "#2D3748" : "#D3D3D3"}`,
  [theme.breakpoints.down("md")]: { flex: 2 },
  [theme.breakpoints.down("sm")]: { flex: 1, borderRight: "none" },
}));

const SearchInputContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(1),
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar,
  backgroundColor: "background.paper",
}));

const WidgetSectionContainer = styled("div")(
  ({ theme, colorMode, isVisible }) => ({
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
  })
);

const CreateLinkupFloatingButton = styled(IconButton)(
  ({ theme, isClose, colorMode, opacity }) => ({
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
  })
);

const FeedWrapper = styled(Box)(({ theme }) => ({
  display: "grid",
  "@media (max-width:900px)": {
    paddingBottom: "65px",
  },
}));

export default function FeedPage({ isMobile }) {
  const { colorMode } = useColorMode();
  const loggedUser = useSelector((s) => s.loggedUser.user || {});
  const userSettings = useSelector((s) => s.userSettings.userSettings || {});
  const { id, gender } = loggedUser;

  // Persist form data
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

  // Feed + pagination
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
  } = useFeed(id, gender, {
    latitude: loggedUser.latitude,
    longitude: loggedUser.longitude,
  });

  const prevScrollTop = useRef(0);

  const filteredFeed = useFilteredFeed(rawFeed, id);
  const { sentRequests } = useSentRequests(id);

  // Responsive widget
  const { isMobileView, isWidgetVisible, toggleWidget } = useResponsiveWidget();

  const showUpdateFeedButton = useSelector(
    (s) => s.linkups.showUpdateFeedButton
  );

  // Search
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

  // Scroll + FAB opacity
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [buttonOpacity, setButtonOpacity] = useState(1);

  const feedRef = useRef();
  const observer = useRef();

  // Scroll position persistence: adjusted to account for content height changes
  useEffect(() => {
    if (!loading && filteredFeed.length && feedRef.current) {
      const saved = sessionStorage.getItem("feedScrollPosition");
      if (saved) {
        const savedScrollTop = Number(saved);
        feedRef.current.scrollTop =
          savedScrollTop * (feedRef.current.scrollHeight / Number(saved));
      }
    }
  }, [loading, filteredFeed.length]);

  // Scroll + FAB opacity
  const handleScroll = useCallback(() => {
    const top = feedRef.current?.scrollTop ?? 0;
    sessionStorage.setItem("feedScrollPosition", top);

    setShowScrollTop(top > 300);

    const isScrollingUp = top < prevScrollTop.current;

    if (isScrollingUp) {
      setButtonOpacity(1); // Reset to full opacity
    } else {
      const opacity = Math.max(0.4, 1 - top / 200);
      setButtonOpacity(opacity);
    }

    prevScrollTop.current = top;
  }, []);
  useEffect(() => {
    const throttledScroll = debounce(handleScroll, 50);
    const node = feedRef.current;
    node?.addEventListener("scroll", throttledScroll);
    return () => node?.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Infinite scroll
  const lastItemRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          const currentScrollTop = feedRef.current?.scrollTop;

          // Save scroll position before incrementing the page
          setTimeout(() => {
            setPage((p) => p + 1);

            // After the page has updated, restore scroll position
            requestAnimationFrame(() => {
              if (currentScrollTop != null && feedRef.current) {
                feedRef.current.scrollTop = currentScrollTop;
              }
            });
          }, 0);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, setPage]
  );

  const scrollToTop = useCallback(() => {
    feedRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleUpdateFeed = useCallback(() => {
    reload();
    scrollToTop();
  }, [reload, scrollToTop]);

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

        {showUpdateFeedButton && (
          <UpdateFeedButton
            refreshFeed={handleUpdateFeed}
            colorMode={colorMode}
          />
        )}

        {showScrollTop && (
          <ScrollToTopButton onClick={scrollToTop} colorMode={colorMode} />
        )}

        {loading ? (
          <LoadingSpinner />
        ) : isSearching ? (
          searchResults.length ? (
            searchResults.map((linkup) => (
              <FeedWrapper key={linkup.id}>
                <FeedItem
                  linkup={linkup}
                  colorMode={colorMode}
                  addLinkup={addLinkup}
                  updateLinkup={updateLinkup}
                  removeLinkup={removeLinkup}
                  useDistance={useDistance}
                  handleScrollToTop={scrollToTop}
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
              handleScrollToTop={scrollToTop}
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
  );
}
