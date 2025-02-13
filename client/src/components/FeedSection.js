import React from "react";
import { useSelector } from "react-redux";
import LinkupItem from "./LinkupItem";
import TopNavBar from "./TopNavBar";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";
import LoadingSpinner from "./LoadingSpinner";
import { styled } from "@mui/material/styles";
import NewLinkupButton from "./NewLinkupButton";

const Root = styled("div")({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderRadius: "8px", // Subtle rounded corners for the whole feed
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow around the feed container
  maxWidth: "100vw",
  minHeight: "100vh",
});

const LoadingContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
});

const FeedSection = ({
  linkupList,
  isLoading,
  setShouldFetchLinkups,
  onRefreshClick,
}) => {
  const userSentRequests = useSelector((state) => state.userSentRequests);
  const showNewLinkupButton = useSelector(
    (state) => state.linkups.showNewLinkupButton
  );
  const { userSettings } = useSelector((state) => state.userSettings); // Use the correct settings from the Redux store

  // Default settings if none exist
  const distanceRange = userSettings?.distanceRange || [0, 1000];
  const ageRange = userSettings?.ageRange || [18, 99];

  // Function to filter linkups based on settings
  const filteredLinkups = linkupList.filter((linkup) => {
    const isWithinDistance =
      linkup.distance >= distanceRange[0] &&
      linkup.distance <= distanceRange[1];
    const isWithinAgeRange =
      linkup.creator_age >= ageRange[0] && linkup.creator_age <= ageRange[1];

    return isWithinDistance && isWithinAgeRange;
  });

  return (
    <Root>
      <TopNavBar title="Home" />
      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <div>
          {filteredLinkups.length === 0 ? (
            <EmptyFeedPlaceholder />
          ) : (
            filteredLinkups.map((linkup) => (
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
          {showNewLinkupButton && <NewLinkupButton onClick={onRefreshClick} />}
        </div>
      )}
    </Root>
  );
};

export default FeedSection;
