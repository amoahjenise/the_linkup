import { useState, useEffect, useCallback, useRef } from "react";
import { getLinkups } from "../api/linkUpAPI";

// useFeed.js - Handles fetching and managing the feed data
export const useFeed = (userId, gender, userLocation, pageSize = 10) => {
  const [feed, setFeed] = useState([]); // Stores the feed data
  const [page, setPage] = useState(0); // Tracks the current page for pagination
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
        newItems.forEach((item) => loadedIds.current.add(item.id));
        setFeed((prev) => [...prev, ...newItems]);

        if (response.linkupList.length < pageSize) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load feed:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, userId, gender, userLocation, pageSize]); // <-- No page, no hasMore

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

  return {
    feed,
    hasMore,
    loading,
    setPage,
    addLinkup,
    updateLinkup,
    removeLinkup,
  };
};
