import React from "react";
import FeedItem from "./FeedItem";
import FeedSkeleton from "./FeedSkeleton";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

// Styled Wrapper
const FeedWrapper = styled(Box)(({ theme }) => ({
  display: "grid",
  "@media (max-width: 900px)": {
    paddingBottom: "65px", // Add padding for footer
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
          <div key={linkup.id} ref={isLastItem ? lastItemRef : null}>
            <FeedItem
              key={linkup.id}
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
          </div>
        );
      })}
      {loading && <FeedSkeleton />}
    </FeedWrapper>
  );
};

export default Feed;
