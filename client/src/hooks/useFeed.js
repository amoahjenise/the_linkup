import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { getLinkups } from "../api/linkUpAPI";
import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";

// useFeed.js - Handles fetching and managing the feed data
export const useFeed = (userId, gender, userLocation, pageSize = 3) => {
  const dispatch = useDispatch();

  const [feed, setFeed] = useState(() => {
    const saved = sessionStorage.getItem("feedData");
    if (saved) {
      try {
        return JSON.parse(saved).feed || [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [page, setPage] = useState(() => {
    const saved = sessionStorage.getItem("feedData");
    if (saved) {
      try {
        return JSON.parse(saved).page || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  });
  const [hasMore, setHasMore] = useState(true); // Indicates whether more feed items exist
  const [loading, setLoading] = useState(false); // Prevents multiple simultaneous fetches
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false); // Ensures feed is only loaded once initially

  const loadedIds = useRef(new Set()); // To keep track of already loaded linkup IDs to avoid duplicates

  const loadFeed = useCallback(async () => {
    if (loading || !userId || !userLocation || !hasMore) return;

    setLoading(true);
    try {
      const offset = page * pageSize;
      const response = await getLinkups(
        userId,
        gender,
        offset,
        pageSize,
        userLocation.latitude,
        userLocation.longitude
      );

      if (response.success && Array.isArray(response.linkupList)) {
        const newItems = response.linkupList.filter(
          (item) => !loadedIds.current.has(item.id)
        );

        // Only update state if we have new items
        if (newItems.length > 0) {
          newItems.forEach((item) => loadedIds.current.add(item.id));

          setFeed((prev) => {
            const updatedFeed = [...prev, ...newItems];
            dispatch(fetchLinkupsSuccess(updatedFeed));
            return updatedFeed;
          });
        }

        // Set hasMore based on whether we got the expected number of items
        setHasMore(response.linkupList.length >= pageSize);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load feed:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    userId,
    gender,
    userLocation,
    pageSize,
    hasMore,
    page,
    dispatch,
  ]);

  useEffect(() => {
    if (!hasLoadedOnce) {
      setHasLoadedOnce(true);
      loadFeed();
    }
  }, [loadFeed]);

  useEffect(() => {
    if (page === 0 || !hasLoadedOnce) return; // Skip if no page change or first load
    loadFeed(); // Fetch new feed data when page changes
  }, [page, hasLoadedOnce]);

  useEffect(() => {
    sessionStorage.setItem(
      "feedData",
      JSON.stringify({
        page,
        feed,
      })
    );
  }, [page, feed]);

  // Add a newly created linkup to the feed
  const addLinkup = (newLinkup) => {
    setFeed((prev) => [newLinkup, ...prev]);
  };

  // Update a linkup in the feed
  const updateLinkup = (updatedLinkup) => {
    setFeed((prev) =>
      prev.map((item) => (item.id === updatedLinkup.id ? updatedLinkup : item))
    );
  };

  // Remove a linkup from the feed
  const removeLinkup = (linkupId) => {
    setFeed((prev) => prev.filter((item) => item.id !== linkupId));
  };

  const refreshFeed = useCallback(async () => {
    if (!userId || !userLocation) return;

    setLoading(true);
    setPage(0); // Reset pagination
    loadedIds.current.clear(); // Reset duplicate tracker

    try {
      const response = await getLinkups(
        userId,
        gender,
        0,
        pageSize,
        userLocation.latitude,
        userLocation.longitude
      );

      if (response.success && Array.isArray(response.linkupList)) {
        const newItems = response.linkupList;
        newItems.forEach((item) => loadedIds.current.add(item.id));

        setFeed(newItems);
        dispatch(fetchLinkupsSuccess(newItems)); // replace in Redux

        setHasMore(response.linkupList.length === pageSize);
      } else {
        setFeed([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to refresh feed:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [userId, gender, userLocation, pageSize, dispatch]);

  return {
    rawFeed: feed,
    hasMore,
    loading,
    setPage,
    addLinkup,
    updateLinkup,
    removeLinkup,
    reload: refreshFeed,
    hasLoadedOnce,
  };
};
