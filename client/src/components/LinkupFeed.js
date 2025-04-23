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
import throttle from "lodash/throttle";
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
  color: "white",
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

    const scrollContainerRef = useRef(null);
    const anchorItemRef = useRef(null);
    const scrollPosRef = useRef(0);
    const linkupCache = useRef({});
    const pageSize = 20;

    const [pullStartY, setPullStartY] = useState(null);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const setRefs = useCallback(
      (node) => {
        scrollContainerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
      const R = 6371;
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

    const loadData = useCallback(
      async (reset = false) => {
        if (loading) return;
        const cacheKey = `${userId}_${gender}_${location.latitude}_${location.longitude}`;

        // Handle cached data
        if (reset && linkupCache.current[cacheKey]) {
          const cachedData = linkupCache.current[cacheKey];
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

          // Use setTimeout instead of requestAnimationFrame for more reliable execution
          setTimeout(() => {
            if (scrollContainerRef.current) {
              const savedPos = sessionStorage.getItem(`feedScroll_${userId}`);
              if (savedPos) {
                scrollContainerRef.current.scrollTop = parseInt(savedPos, 10);
              }
            }
          }, 0);
          return;
        }

        setLoading(true);
        try {
          const anchorIndex = reset
            ? 0
            : Math.floor(scrollPosRef.current / 300);
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
              linkupCache.current[cacheKey] = {
                linkups: enrichedLinkups,
                offset: enrichedLinkups.length,
                hasMore: enrichedLinkups.length === pageSize,
                timestamp: Date.now(),
              };
            }

            // Update state first
            setLinkups(newLinkups);
            setOffset(
              reset ? enrichedLinkups.length : offset + enrichedLinkups.length
            );
            setHasMore(enrichedLinkups.length === pageSize);

            dispatch({
              type: "MERGE_LINKUPS_SUCCESS",
              payload: {
                newLinkups: enrichedLinkups,
                isInitialLoad: reset,
              },
            });

            // Then handle scroll position after state updates
            setTimeout(() => {
              if (!scrollContainerRef.current) return;

              if (reset) {
                const savedPos = sessionStorage.getItem(`feedScroll_${userId}`);
                scrollContainerRef.current.scrollTop = savedPos
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
                  if (anchorItem && scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                      top: anchorItem.offsetTop - (scrollPosRef.current % 300),
                      behavior: "auto",
                    });
                  }
                }
              }
            }, 0);
          }
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setLoading(false);
        }
      },
      [
        userId,
        gender,
        location.latitude,
        location.longitude,
        loading,
        offset,
        dispatch,
        calculateDistance,
        linkups,
      ]
    );

    const throttledSaveScroll = useMemo(
      () =>
        throttle((pos) => {
          sessionStorage.setItem(`feedScroll_${userId}`, pos.toString());
        }, 500),
      [userId]
    );

    const handleScroll = useCallback(() => {
      if (!scrollContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      throttledSaveScroll(scrollTop);
      scrollPosRef.current = scrollTop;
      setShowScrollButton(scrollTop > 300);

      if (
        scrollHeight - scrollTop - clientHeight < 800 &&
        hasMore &&
        !loading &&
        !isSearching
      ) {
        loadData();
      }
    }, [hasMore, loading, isSearching, throttledSaveScroll, loadData]);

    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const handleTouchStart = (e) => {
      if (scrollContainerRef.current?.scrollTop === 0 && !isRefreshing) {
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

    useEffect(() => {
      const now = Date.now();
      for (const key in linkupCache.current) {
        if (now - linkupCache.current[key].timestamp > 300000) {
          delete linkupCache.current[key];
        }
      }

      loadData(true);
    }, [userId, gender, location]);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          const savedPos = sessionStorage.getItem(`feedScroll_${userId}`);
          if (savedPos) {
            scrollContainerRef.current.scrollTop = parseInt(savedPos, 10);
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }, [userId]);

    useEffect(() => {
      return () => {
        throttledSaveScroll.flush();
      };
    }, [throttledSaveScroll]);

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

    useEffect(() => {
      return () => debouncedSearch.cancel();
    }, [debouncedSearch]);

    const scrollToTop = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };

    useImperativeHandle(ref, () => ({
      scrollToTop,
    }));

    useEffect(() => {
      const handleBeforeUnload = () => {
        if (scrollContainerRef.current) {
          sessionStorage.setItem(
            `feedScroll_${userId}`,
            scrollContainerRef.current.scrollTop.toString()
          );
        }
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [userId]);

    return (
      <div
        ref={setRefs}
        style={{
          height: "100vh",
          overflowY: "auto",
          position: "relative", // This is already present
          display: "flex",
          flexDirection: "column",
          borderRadius: "8px",
          maxWidth: "100vw",
          minHeight: "100dvh",
          marginBottom: isMobile ? 64 : 15,
          width: "100%",
          overscrollBehavior: "contain",
          scrollBehavior: "auto",
          touchAction: "pan-y",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
