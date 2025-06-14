import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
  useState,
  useEffect,
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
    const outerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(0);

    useImperativeHandle(ref, () => ({
      scrollTo: (options) => {
        if (listRef.current) {
          listRef.current.scrollTo(options?.top ?? 0);
        }
      },
      getScrollElement: () => outerRef.current,
      getScrollPosition: () => {
        return outerRef.current?.scrollTop ?? 0;
      },
      isReady: () => !!listRef.current && !!outerRef.current,
      getState: () => ({
        scrollOffset: listRef.current?.state?.scrollOffset ?? 0,
        scrollDirection: listRef.current?.state?.scrollDirection ?? "forward",
      }),
    }));

    // Adjust the item size to be smaller (200px instead of 250px)
    const getItemSize = useCallback(() => 200, []); // Adjusted height here

    const onScroll = ({ scrollOffset }) => {
      if (
        hasMore &&
        !loading &&
        scrollOffset + containerHeight >= linkups.length * getItemSize() - 300
      ) {
        loadMore();
      }
    };

    useEffect(() => {
      const estimatedContentHeight = linkups.length * getItemSize();
      if (
        hasMore &&
        !loading &&
        containerHeight > 0 &&
        estimatedContentHeight <= containerHeight + 100
      ) {
        loadMore();
      }
    }, [
      linkups.length,
      containerHeight,
      hasMore,
      loading,
      loadMore,
      getItemSize,
    ]);

    return (
      <AutoSizer>
        {({ height, width }) => {
          if (containerHeight !== height) {
            setContainerHeight(height);
          }

          return (
            <List
              height={height}
              itemCount={linkups.length}
              itemSize={getItemSize}
              width={width}
              onScroll={onScroll}
              ref={listRef}
              outerRef={outerRef}
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
