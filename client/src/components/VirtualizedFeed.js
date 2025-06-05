import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
  useState,
} from "react";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import FeedItem from "./FeedItem";

const VirtualizedFeed = forwardRef(
  (
    {
      linkups,
      loadMore,
      loading,
      hasMore,
      colorMode,
      addLinkup,
      updateLinkup,
      removeLinkup,
      handleScrollToTop,
      loggedUser,
      sentRequests,
    },
    ref
  ) => {
    const listRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(0);

    useImperativeHandle(ref, () => ({
      scrollTo: (options) => {
        listRef.current?.scrollTo(options?.top ?? 0);
      },
      getScrollElement: () => listRef.current?.outerRef?.firstElementChild, // Get the actual scroll container
      getScrollPosition: () => listRef.current?.state?.scrollOffset ?? 0,
    }));

    const getItemSize = useCallback(() => 250, []);

    const onScroll = ({ scrollOffset }) => {
      if (
        hasMore &&
        !loading &&
        scrollOffset + containerHeight >= linkups.length * getItemSize() - 100
      ) {
        loadMore();
      }
    };

    return (
      <AutoSizer>
        {({ height, width }) => {
          // Update containerHeight state on every AutoSizer resize
          if (height !== containerHeight) setContainerHeight(height);

          return (
            <List
              height={height}
              itemCount={linkups.length}
              itemSize={getItemSize}
              width={width}
              onScroll={onScroll}
              ref={listRef}
              overscanCount={2}
              style={{
                scrollbarWidth: "thin",
                scrollbarColor:
                  colorMode === "dark"
                    ? "#4a5568 transparent"
                    : "#cbd5e0 transparent",
              }}
            >
              {({ index, style }) => (
                <div style={style}>
                  <FeedItem
                    linkup={linkups[index]}
                    colorMode={colorMode}
                    addLinkup={addLinkup}
                    updateLinkup={updateLinkup}
                    removeLinkup={removeLinkup}
                    handleScrollToTop={handleScrollToTop}
                    loggedUser={loggedUser}
                    sentRequests={sentRequests}
                  />
                </div>
              )}
            </List>
          );
        }}
      </AutoSizer>
    );
  }
);

export default VirtualizedFeed;
