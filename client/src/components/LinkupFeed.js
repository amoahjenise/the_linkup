import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useSelector } from "react-redux";
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
  bottom: "80px",
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
  ({ userId, gender, location, refreshFeed, colorMode }, ref) => {
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

    // Load data with scroll anchoring and caching
    const loadData = async (reset = false) => {
      if (loading) return;

      // Check cache first for initial load
      if (reset && linkupCache.current[userId]) {
        const cachedData = linkupCache.current[userId];
        setLinkups(cachedData.linkups);
        setOffset(cachedData.offset);
        setHasMore(cachedData.hasMore);

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
          const newLinkups = reset
            ? response.linkupList
            : [...linkups, ...response.linkupList];

          if (reset) {
            linkupCache.current[userId] = {
              linkups: response.linkupList,
              offset: response.linkupList.length,
              hasMore: response.linkupList.length === pageSize,
              timestamp: Date.now(),
            };
          }

          setLinkups(newLinkups);
          setOffset(
            reset
              ? response.linkupList.length
              : offset + response.linkupList.length
          );
          setHasMore(response.linkupList.length === pageSize);

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
        }}
      >
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
