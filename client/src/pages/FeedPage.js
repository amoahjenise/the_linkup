import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useFeed } from "../hooks/useFeed";
import LoadingSpinner from "../components/LoadingSpinner";
import TopNavBar from "../components/TopNavBar";
import WidgetSection from "../components/WidgetSection";
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useColorMode } from "@chakra-ui/react";
import { Suspense, lazy } from "react";
import { useResponsiveWidget } from "../hooks/useResponsiveWidget";

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

const FloatingButton = ({ onClick, isClose, colorMode }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "fixed",
      ...(isClose
        ? { top: "16px", right: "16px" }
        : { bottom: "100px", right: "32px" }),
      zIndex: 2100,
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
      p: 1.5,
    }}
  >
    {isClose ? <CloseIcon /> : <AddIcon />}
  </IconButton>
);

const FeedPage = () => {
  const { colorMode } = useColorMode();
  const loggedUser = useSelector((state) => state.loggedUser?.user || {});

  const { id, gender, latitude, longitude } = loggedUser;

  const {
    feed,
    hasMore,
    loading,
    setPage,
    addLinkup,
    updateLinkup,
    removeLinkup,
    useDistance,
  } = useFeed(id, gender, {
    latitude,
    longitude,
  });

  const { isMobileView, isWidgetVisible, toggleWidget } = useResponsiveWidget();

  const feedRef = useRef(null);
  const observer = useRef();

  // Store and restore the scroll position
  useEffect(() => {
    if (!loading && feed.length > 0 && feedRef.current) {
      const savedScroll = sessionStorage.getItem("feedScrollPosition");
      if (savedScroll !== null) {
        feedRef.current.scrollTop = parseInt(savedScroll, 10);
      }
    }
  }, [loading, feed]);

  // Save the scroll position on scroll
  const handleScroll = () => {
    if (feedRef.current) {
      sessionStorage.setItem("feedScrollPosition", feedRef.current.scrollTop);
    }
  };

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

  if (loading) return <LoadingSpinner />;

  return (
    <FeedPageContainer>
      <FeedSection ref={feedRef} onScroll={handleScroll} colorMode={colorMode}>
        <TopNavBar title="Home" />
        <Suspense fallback={<LoadingSpinner />}>
          <Feed
            linkups={feed}
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
          />
        </Suspense>
      </FeedSection>

      <WidgetSectionContainer colorMode={colorMode} isVisible={isWidgetVisible}>
        {isMobileView && (
          <FloatingButton
            onClick={toggleWidget}
            isClose
            colorMode={colorMode}
          />
        )}
        <WidgetSection
          toggleWidget={toggleWidget}
          isMobile={isMobileView}
          addLinkup={addLinkup}
          handleScrollToTop={handleScrollToTop}
        />
      </WidgetSectionContainer>

      {isMobileView && !isWidgetVisible && (
        <FloatingButton
          onClick={toggleWidget}
          isClose={false}
          colorMode={colorMode}
        />
      )}
    </FeedPageContainer>
  );
};

export default FeedPage;
