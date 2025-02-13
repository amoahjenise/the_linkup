import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import LinkupItem from "./LinkupItem";
import TopNavBar from "./TopNavBar";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";
import LoadingSpinner from "./LoadingSpinner";
import { styled } from "@mui/material/styles";
import NewLinkupButton from "./NewLinkupButton";
import SearchInput from "./SearchInputWidget";
import { searchLinkups } from "../api/linkUpAPI";
import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";
import debounce from "lodash/debounce";

const Root = styled("div")({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderRadius: "8px", // Subtle rounded corners for the whole feed
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow around the feed container
  maxWidth: "100vw",
  minHeight: "100vh",
  padding: "16px", // Adding padding for better layout
});

const LoadingContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
});

const SearchInputContainer = styled("div")(({ theme, colorMode }) => ({
  padding: 8,
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const FeedSection = ({
  linkupList,
  isLoading,
  setShouldFetchLinkups,
  onRefreshClick,
  userId,
  gender,
}) => {
  const dispatch = useDispatch();
  const userSentRequests = useSelector((state) => state.userSentRequests);
  const showNewLinkupButton = useSelector(
    (state) => state.linkups.showNewLinkupButton
  );
  const { userSettings } = useSelector((state) => state.userSettings);
  const [loading, setLoading] = useState(false);
  const [filteredLinkups, setFilteredLinkups] = useState(linkupList); // Initial filtered list based on linkupList

  const distanceRange = userSettings?.distanceRange || [0, 1000];
  const ageRange = userSettings?.ageRange || [18, 99];

  // Persist debounced function using useRef to avoid recreation
  const debounceSearchRef = useRef(
    debounce(async (value) => {
      try {
        setLoading(true);

        // Make API call with the search query and user settings
        const response = await searchLinkups(
          value,
          userId,
          gender,
          distanceRange,
          ageRange
        );
        dispatch(fetchLinkupsSuccess(response.linkupList)); // Dispatch updated linkups from API
        setFilteredLinkups(response.linkupList); // Set filtered linkups state with the result
      } catch (error) {
        console.error("Error fetching linkups:", error);
      } finally {
        setLoading(false);
      }
    }, 300)
  );

  // Function to handle input change and trigger search
  const handleInputChange = (event) => {
    debounceSearchRef.current(event.target.value);
  };

  return (
    <Root>
      <TopNavBar title="Home" />
      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <div>
          {/* Search Input Component */}
          <SearchInputContainer>
            <SearchInput
              handleInputChange={handleInputChange}
              loading={loading}
            />
          </SearchInputContainer>
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
