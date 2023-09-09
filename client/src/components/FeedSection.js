import React from "react";
import { useSelector } from "react-redux";
import LinkupItem from "./LinkupItem";
import TopNavBar from "./TopNavBar";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";
import LoadingSpinner from "./LoadingSpinner";

const FeedSection = ({ linkupList, isLoading, setShouldFetchLinkups }) => {
  const userSentRequests = useSelector((state) => state.userSentRequests);

  return (
    <div>
      <TopNavBar title="Home" />
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <LoadingSpinner />
        </div>
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
                disableRequest={userSentRequests.includes(linkup.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FeedSection;
