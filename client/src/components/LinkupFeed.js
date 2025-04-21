import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLinkups, searchLinkups } from "../api/linkUpAPI";
import LinkupItem from "./LinkupItem";
import { Button, styled } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import LoadingSpinner from "./LoadingSpinner";
import TopNavBar from "../components/TopNavBar";
import SearchInput from "./SearchInputWidget";
import debounce from "lodash/debounce";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";
import NewLinkupButton from "./NewLinkupButton";

// Add these styles for the pull-to-refresh indicator
const PullToRefreshContainer = styled("div")(({ theme, refreshing }) => ({
  position: "relative",
  height: refreshing ? "60px" : "0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  transition: "height 0.3s ease",
}));

const RefreshSpinner = styled("div")(({ theme, pullDistance }) => ({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  border: `3px solid ${theme.palette.primary.main}`,
  borderTopColor: "transparent",
  animation: "spin 1s linear infinite",
  opacity: Math.min(1, pullDistance / 100),
  transform: `rotate(${Math.min(360, pullDistance * 2)}deg)`,
  transition: "transform 0.2s ease, opacity 0.2s ease",
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
}));

const SearchInputContainer = styled("div")(({ theme }) => ({
  padding: 8,
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar,
  backgroundColor: "background.paper",
}));

const ScrollToTopButton = styled(Button)(({ theme }) => ({
  position: "sticky",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: "30px",
  // Responsive widths for larger screens
  [theme.breakpoints.up("md")]: {
    // ≥900px
    bottom: 0,
  },
  zIndex: 1100,
  width: "100px",
  height: "32px",
  borderRadius: "9999px",
  backgroundColor: "rgba(0, 151, 167, 0.3)",
  color: "#FFFFFF",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(0, 151, 167, 0.3)",
  padding: 0,
  opacity: 0.9,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  transition: "opacity 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(0, 151, 167, 0.5)",
  },
}));

const LinkupFeed = forwardRef(
  ({ userId, gender, location, refreshFeed, colorMode, isMobile }, ref) => {
    const dispatch = useDispatch();
    // Data state
    const { userSettings } = useSelector((state) => state.userSettings);
    const userSentRequests = useSelector((state) => state.userSentRequests);
    const showNewLinkupButton = useSelector(
      (state) => state.linkups.showNewLinkupButton
    );
    const [linkups, setLinkups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const feedRef = useRef(null);
    const anchorItemRef = useRef(null);
    const scrollPosRef = useRef(0);
    const linkupCache = useRef({});
    const pageSize = 20;

    const [pullStartY, setPullStartY] = useState(null);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Add these handlers for touch events
    const handleTouchStart = (e) => {
      if (feedRef.current?.scrollTop === 0 && !isRefreshing) {
        setPullStartY(e.touches[0].pageY);
      }
    };

    const handleTouchMove = (e) => {
      if (pullStartY === null) return;

      const y = e.touches[0].pageY;
      const pullDistance = y - pullStartY;

      if (pullDistance > 0) {
        e.preventDefault();
        setPullDistance(pullDistance);
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > 100) {
        setIsRefreshing(true);
        refreshFeed().finally(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        });
      } else {
        setPullDistance(0);
      }
      setPullStartY(null);
    };

    const calculateAge = useCallback((dob) => {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    }, []);

    const { distanceRange, ageRange, genderPreferences } = useMemo(
      () => ({
        distanceRange: userSettings?.distanceRange || [0, 1000],
        ageRange: userSettings?.ageRange || [18, 99],
        genderPreferences: userSettings?.genderPreferences || [],
      }),
      [userSettings]
    );

    const filterLinkups = useCallback(() => {
      return linkups.filter((linkup) => {
        if (linkup.creator_id === userId) return true;

        const distance = linkup.distance || 0;
        const age = calculateAge(linkup.date_of_birth) || 0;
        const genderMatch =
          genderPreferences.length === 0 ||
          genderPreferences.includes(linkup.creator_gender?.toLowerCase());

        return (
          distance >= distanceRange[0] &&
          distance <= distanceRange[1] &&
          age >= ageRange[0] &&
          age <= ageRange[1] &&
          genderMatch
        );
      });
    }, [
      linkups,
      userId,
      distanceRange,
      ageRange,
      genderPreferences,
      calculateAge,
    ]);

    const filteredLinkups = useMemo(() => filterLinkups(), [filterLinkups]);

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

    // Scroll to top function
    const scrollToTop = () => {
      if (feedRef.current) {
        feedRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };

    // Expose scrollToTop to parent via ref
    useImperativeHandle(ref, () => ({
      scrollToTop,
    }));

    // Check scroll position to show/hide button
    useEffect(() => {
      const feed = feedRef.current;
      if (!feed) return;

      const handleScroll = () => {
        if (feed.scrollTop > 300) {
          setShowScrollButton(true);
        } else {
          setShowScrollButton(false);
        }
        scrollPosRef.current = feed.scrollTop;
        sessionStorage.setItem(`feedScroll_${userId}`, feed.scrollTop);
      };

      feed.addEventListener("scroll", handleScroll);
      return () => feed.removeEventListener("scroll", handleScroll);
    }, [userId]);

    // Store scroll position before unloading
    useEffect(() => {
      const handleBeforeUnload = () => {
        if (feedRef.current) {
          sessionStorage.setItem(
            `feedScroll_${userId}`,
            feedRef.current.scrollTop
          );
        }
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [userId]);

    // Search function with debounce
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
            const response = await searchLinkups(
              query,
              userId,
              gender,
              distanceRange,
              ageRange
            );
            setSearchResults(response.linkupList || []);
            setIsSearching(true);
          } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
          } finally {
            setSearchLoading(false);
          }
        }, 300),
      [userId, gender, distanceRange, ageRange]
    );

    const handleSearchChange = (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      debouncedSearch(query);
    };

    // Cleanup debounce on unmount
    useEffect(() => {
      return () => {
        debouncedSearch.cancel();
      };
    }, [debouncedSearch]);

    const loadData = async (reset = false) => {
      if (loading) return;

      if (reset && linkupCache.current[userId]) {
        const cachedData = linkupCache.current[userId];
        setLinkups(cachedData.linkups);
        setOffset(cachedData.offset);
        setHasMore(cachedData.hasMore);

        dispatch({
          type: "MERGE_LINKUPS_SUCCESS",
          payload: {
            newLinkups: cachedData.linkups,
            isInitialLoad: true,
          },
        });

        requestAnimationFrame(() => {
          if (feedRef.current) {
            const savedPos = sessionStorage.getItem(`feedScroll_${userId}`);
            feedRef.current.scrollTop = savedPos ? parseInt(savedPos, 10) : 0;
          }
        });
        return;
      }

      setLoading(true);
      try {
        const anchorIndex = reset ? 0 : Math.floor(scrollPosRef.current / 300);
        const anchorId = linkups[anchorIndex]?.id;

        const response = await getLinkups(
          userId,
          gender,
          reset ? 0 : offset,
          pageSize,
          location.latitude,
          location.longitude
        );

        if (response?.linkupList) {
          const enrichedLinkups = response.linkupList.map((linkup) => ({
            ...linkup,
            isUserCreated: linkup.creator_id === userId,
            createdAtTimestamp: linkup.created_at,
            distance: calculateDistance(
              location.latitude,
              location.longitude,
              linkup.latitude,
              linkup.longitude
            ),
          }));

          enrichedLinkups.sort((a, b) => {
            const createdAtComparison =
              new Date(b.createdAtTimestamp) - new Date(a.createdAtTimestamp);
            return createdAtComparison !== 0
              ? createdAtComparison
              : a.distance - b.distance;
          });

          const newLinkups = reset
            ? enrichedLinkups
            : [...linkups, ...enrichedLinkups];

          if (reset) {
            linkupCache.current[userId] = {
              linkups: enrichedLinkups,
              offset: enrichedLinkups.length,
              hasMore: enrichedLinkups.length === pageSize,
              timestamp: Date.now(),
            };
          }

          // Redux dispatch here
          dispatch({
            type: "MERGE_LINKUPS_SUCCESS",
            payload: {
              newLinkups: enrichedLinkups,
              isInitialLoad: reset,
            },
          });

          setLinkups(newLinkups);
          setOffset(
            reset ? enrichedLinkups.length : offset + enrichedLinkups.length
          );
          setHasMore(enrichedLinkups.length === pageSize);

          requestAnimationFrame(() => {
            if (feedRef.current) {
              if (reset) {
                const savedPos = sessionStorage.getItem(`feedScroll_${userId}`);
                feedRef.current.scrollTop = savedPos
                  ? parseInt(savedPos, 10)
                  : 0;
              } else if (anchorId) {
                const anchorIndex = newLinkups.findIndex(
                  (item) => item.id === anchorId
                );
                if (anchorIndex >= 0) {
                  const anchorItem = document.getElementById(
                    `item-${anchorId}`
                  );
                  if (anchorItem) {
                    feedRef.current.scrollTop =
                      anchorItem.offsetTop - (scrollPosRef.current % 300);
                  }
                }
              }
            }
          });
        }
      } finally {
        setLoading(false);
      }
    };

    // Initial load with cache check
    useEffect(() => {
      const now = Date.now();
      for (const key in linkupCache.current) {
        if (now - linkupCache.current[key].timestamp > 300000) {
          delete linkupCache.current[key];
        }
      }

      loadData(true);
    }, [userId, gender, location]);

    // Scroll handler for infinite loading
    useEffect(() => {
      const feed = feedRef.current;
      if (!feed) return;

      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = feed;
        if (
          scrollHeight - scrollTop - clientHeight < 800 &&
          hasMore &&
          !loading &&
          !isSearching
        ) {
          loadData();
        }
      };

      feed.addEventListener("scroll", handleScroll, { passive: true });
      return () => feed.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading, isSearching]);

    return (
      <div
        ref={feedRef}
        style={{
          height: "100vh",
          overflowY: "auto",
          overscrollBehavior: "contain",
          scrollBehavior: "auto",
          paddingBottom: "calc(40px + env(safe-area-inset-bottom))",
          touchAction: "pan-y", // Add this for better touch control
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull-to-refresh indicator must be FIRST child */}
        <PullToRefreshContainer refreshing={isRefreshing}>
          {isRefreshing ? (
            <LoadingSpinner />
          ) : (
            <RefreshSpinner pullDistance={pullDistance} />
          )}
        </PullToRefreshContainer>

        <TopNavBar title={"Home"} />

        <SearchInputContainer>
          <SearchInput
            handleInputChange={handleSearchChange}
            loading={searchLoading}
            value={searchQuery}
          />
        </SearchInputContainer>
        {showNewLinkupButton && (
          <NewLinkupButton refreshFeed={refreshFeed} colorMode={colorMode} />
        )}
        {loading ? (
          <LoadingSpinner />
        ) : isSearching ? (
          searchResults.length > 0 ? (
            searchResults.map((linkup) => (
              <LinkupItem
                key={linkup.id}
                id={`item-${linkup.id}`}
                linkupId={linkup.id}
                linkupItem={linkup}
                userId={userId}
                refreshFeed={refreshFeed}
                disableRequest={userSentRequests.some(
                  (req) => req.linkup_id === linkup.id
                )}
                isMobile={isMobile}
              />
            ))
          ) : (
            <EmptyFeedPlaceholder message="No matching linkups found" />
          )
        ) : filteredLinkups.length === 0 ? (
          <LoadingSpinner />
        ) : (
          filteredLinkups.map((linkup, index) => (
            <LinkupItem
              key={linkup.id}
              id={`item-${linkup.id}`}
              linkupId={linkup.id}
              linkupItem={linkup}
              userId={userId}
              ref={
                index === Math.floor(filteredLinkups.length / 2)
                  ? anchorItemRef
                  : null
              }
              refreshFeed={refreshFeed}
              disableRequest={userSentRequests.some(
                (req) => req.linkup_id === linkup.id
              )}
              scrollToTop={scrollToTop}
            />
          ))
        )}

        {loading && !isSearching && (
          <div style={{ padding: 16, textAlign: "center", color: "#888" }}>
            <LoadingSpinner />
          </div>
        )}

        {showScrollButton && (
          <ScrollToTopButton onClick={scrollToTop} colorMode={colorMode}>
            <KeyboardArrowUp fontSize="small" />
            Top
          </ScrollToTopButton>
        )}
      </div>
    );
  }
);

export default LinkupFeed;
