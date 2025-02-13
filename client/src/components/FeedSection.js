import React, { useState, useEffect, useRef } from "react";
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
import Button from "@mui/material/Button";

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

const SearchInputContainer = styled("div")(({ theme, colorMode }) => ({
  padding: 8,
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  position: "fixed",
  bottom: "3%", // Adjusted position to place the button above the first linkup item
  left: "47%",
  transform: "translateX(-50%)",
  zIndex: 3000,
  padding: "5px 10px",
  fontSize: "12px",
  borderRadius: "20px",
  background:
    "linear-gradient(120deg, rgba(0, 121, 107, 0.4), rgba(150, 190, 220, 0.4))",
  color: "#fff",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, background 0.3s ease", // Add transition for smooth animation
  "&:hover": {
    background: "linear-gradient(120deg, #004D40, rgba(120, 160, 190, 1))", // Adjust hover effect
    transform: "translateX(-50%) translateY(-5px)", // Slide up effect
  },
}));

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  // Adjust the age if the birthday hasn't occurred yet this year
  if (
    month < birthDate.getMonth() ||
    (month === birthDate.getMonth() && day < birthDate.getDate())
  ) {
    return age - 1;
  }

  return age;
};

const FeedSection = ({
  linkupList,
  isLoading,
  setShouldFetchLinkups,
  onRefreshClick,
  userId,
  gender,
  feedRef,
}) => {
  const dispatch = useDispatch();
  const userSentRequests = useSelector((state) => state.userSentRequests);
  const showNewLinkupButton = useSelector(
    (state) => state.linkups.showNewLinkupButton
  );
  const { userSettings } = useSelector((state) => state.userSettings);
  const [loading, setLoading] = useState(false);
  const [filteredLinkups, setFilteredLinkups] = useState(linkupList); // Initial filtered list based on linkupList
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false); // State to control button visibility

  const distanceRange = userSettings?.distanceRange || [0, 1000];
  const ageRange = userSettings?.ageRange || [18, 99];
  const genderRange = userSettings?.genderRange || [];

  // Apply filtering logic based on user settings
  useEffect(() => {
    const filterLinkups = () => {
      return linkupList.filter((linkup) => {
        // Distance filter
        const distance = linkup.distance || 0;
        if (distance < distanceRange[0] || distance > distanceRange[1]) {
          return false;
        }

        // Age filter
        const age = calculateAge(linkup.date_of_birth) || 0;
        if (age < ageRange[0] || age > ageRange[1]) {
          return false;
        }

        // Gender filter (if any selected)
        if (
          genderRange.length > 0 &&
          !genderRange.includes(linkup.creator_gender)
        ) {
          return false;
        }

        return true;
      });
    };

    const filtered = filterLinkups();
    setFilteredLinkups(filtered);
  }, [linkupList, userSettings]); // Re-run filter when linkupList or userSettings change

  const scrollToTop = () => {
    if (feedRef.current) {
      feedRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Handle scroll position to toggle the scroll-to-top button
  const handleScroll = () => {
    if (feedRef.current) {
      const scrollPosition = feedRef.current.scrollTop;
      // Show button when scrolled down more than 200px
      setShowScrollToTopButton(scrollPosition > 200);
    }
  };

  // Add scroll event listener when the component mounts
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (feedRef.current) {
        feedRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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
      {/* Search Input Component */}
      <SearchInputContainer>
        <SearchInput handleInputChange={handleInputChange} loading={loading} />
      </SearchInputContainer>
      {/* Show LoadingSpinner when filtering or fetching data */}
      {(isLoading || loading) && (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      )}
      {/* Render filtered linkups or empty state */}
      {!isLoading && !loading && (
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
          {showScrollToTopButton && (
            <StyledButton variant="contained" onClick={scrollToTop}>
              Tap to scroll to top
            </StyledButton>
          )}
        </div>
      )}
    </Root>
  );
};

export default FeedSection;
