import React, { useRef, useCallback } from "react";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import FeedItem from "./FeedItem";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

const Container = styled("div")({
  position: "relative",
  width: "100%",
  height: "100%",
});

const EmptyState = styled("div")(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
}));

const LoadingContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const EndMessage = styled("div")(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(2),
}));

const VirtualizedFeed = React.memo(
  ({
    linkups,
    colorMode = "dark",
    addLinkup,
    updateLinkup,
    removeLinkup,
    useDistance,
    handleScrollToTop,
    loggedUser,
    sentRequests,
    loading,
    hasMore,
    loadMore,
    outerRef,
  }) => {
    const listRef = useRef(null);
    const sizeMap = useRef({});
    const itemRefs = useRef([]);

    // Initialize refs array
    if (itemRefs.current.length !== linkups.length) {
      itemRefs.current = Array(linkups.length)
        .fill()
        .map((_, i) => itemRefs.current[i] || React.createRef());
    }

    const setItemSize = useCallback((index, size) => {
      if (sizeMap.current[index] !== size) {
        sizeMap.current = { ...sizeMap.current, [index]: size };
        listRef.current?.resetAfterIndex(index);
      }
    }, []);

    const getItemSize = (index) => sizeMap.current[index] || 280;

    const Row = ({ index, style }) => {
      const linkup = linkups[index];
      return (
        <div style={{ ...style, paddingBottom: "16px" }}>
          <FeedItem
            ref={itemRefs.current[index]}
            linkup={linkup}
            colorMode={colorMode}
            addLinkup={addLinkup}
            updateLinkup={updateLinkup}
            removeLinkup={removeLinkup}
            useDistance={useDistance}
            handleScrollToTop={handleScrollToTop}
            loggedUser={loggedUser}
            sentRequests={sentRequests}
            onHeightChange={(height) => setItemSize(index, height + 24)}
          />
        </div>
      );
    };

    // Update item sizes when data changes
    React.useEffect(() => {
      if (itemRefs.current.length > 0) {
        itemRefs.current.forEach((ref, index) => {
          if (ref.current) {
            const height = ref.current.getBoundingClientRect().height;
            setItemSize(index, height + 40);
          }
        });
      }
    }, [linkups, setItemSize]);

    return (
      <Container ref={outerRef}>
        {linkups.length > 0 ? (
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={listRef}
                height={height}
                width={width}
                itemCount={linkups.length}
                itemSize={getItemSize}
                overscanCount={5}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor:
                    colorMode === "dark"
                      ? "#4a5568 transparent"
                      : "#cbd5e0 transparent",
                }}
                onItemsRendered={({ visibleStopIndex }) => {
                  if (
                    visibleStopIndex === linkups.length - 1 &&
                    hasMore &&
                    !loading
                  ) {
                    loadMore();
                  }
                }}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        ) : (
          <EmptyState>No linkups to display</EmptyState>
        )}
        {loading && (
          <LoadingContainer>
            <div
              style={{
                animation: "spin 1s linear infinite",
                borderRadius: "50%",
                height: "24px",
                width: "24px",
                border: "2px solid",
                borderColor:
                  colorMode === "dark"
                    ? "#4a5568 transparent transparent"
                    : "#cbd5e0 transparent transparent",
                borderTopColor: "#3182ce",
              }}
            />
          </LoadingContainer>
        )}
      </Container>
    );
  }
);

VirtualizedFeed.propTypes = {
  linkups: PropTypes.array.isRequired,
  colorMode: PropTypes.string,
  addLinkup: PropTypes.func.isRequired,
  updateLinkup: PropTypes.func.isRequired,
  removeLinkup: PropTypes.func.isRequired,
  useDistance: PropTypes.func.isRequired,
  handleScrollToTop: PropTypes.func.isRequired,
  loggedUser: PropTypes.object.isRequired,
  sentRequests: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
};

export default VirtualizedFeed;
