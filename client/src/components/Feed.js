import React from "react";
import FeedItem from "./FeedItem";
import FeedSkeleton from "./FeedSkeleton";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

// Styled Wrapper
const FeedWrapper = styled(Box)(({ theme }) => ({
  display: "grid",
  "@media (max-width: 900px)": {
    paddingBottom: "65px",
  },
}));

const Feed = ({
  linkups,
  loading,
  colorMode,
  lastItemRef,
  addLinkup,
  updateLinkup,
  removeLinkup,
  useDistance,
  handleScrollToTop,
  loggedUser,
  sentRequests,
}) => {
  return (
    <FeedWrapper>
      {linkups.map((linkup, index) => {
        const isLastItem = index === linkups.length - 1;
        return (
          <Box
            data-feed-item
            key={linkup.id}
            ref={isLastItem ? lastItemRef : null}
          >
            <FeedItem
              linkup={linkup}
              colorMode={colorMode}
              addLinkup={addLinkup}
              updateLinkup={updateLinkup}
              removeLinkup={removeLinkup}
              useDistance={useDistance}
              handleScrollToTop={handleScrollToTop}
              loggedUser={loggedUser}
              sentRequests={sentRequests}
            />
          </Box>
        );
      })}
      {loading && <FeedSkeleton />}
    </FeedWrapper>
  );
};

export default Feed;
