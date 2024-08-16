import React from "react";
import { useSelector } from "react-redux";
import LinkupItem from "./LinkupItem";
import TopNavBar from "./TopNavBar";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";
import LoadingSpinner from "./LoadingSpinner";
import { styled } from "@mui/material/styles";

const Root = styled("div")({
  position: "relative",
});

const LoadingContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
});

const FeedSection = ({ linkupList, isLoading, setShouldFetchLinkups }) => {
  const userSentRequests = useSelector((state) => state.userSentRequests);

  return (
    <Root>
      <TopNavBar title="Home" />
      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <div>
          {linkupList.length === 0 ? (
            <EmptyFeedPlaceholder />
          ) : (
            linkupList.map((linkup) => (
              <LinkupItem
                key={linkup.id}
                linkupItem={linkup}
                setShouldFetchLinkups={setShouldFetchLinkups}
                disableRequest={userSentRequests.some(
                  (request) => request.linkup_id === linkup.id
                )}
              />
            ))
          )}
        </div>
      )}
    </Root>
  );
};

export default FeedSection;
