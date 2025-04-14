import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { Button, Skeleton } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { keyframes } from "@mui/system";
import debounce from "lodash/debounce";
import LinkupItem from "./LinkupItem";
import TopNavBar from "./TopNavBar";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";
import LoadingSpinner from "./LoadingSpinner";
import NewLinkupButton from "./NewLinkupButton";
import SearchInput from "./SearchInputWidget";
import { searchLinkups } from "../api/linkUpAPI";
import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";

// Styled components remain at the top level
const Root = styled("div")(({ theme, isMobile }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderRadius: "8px",
  maxWidth: "100vw",
  minHeight: "100dvh",
  marginBottom: isMobile ? 64 : 15,
}));

const rotate = keyframes`
  0% { transform: rotate(0deg); opacity: 0.5; }
  50% { transform: rotate(180deg); opacity: 1; }
  100% { transform: rotate(360deg); opacity: 0.5; }
`;

const RefreshArrow = styled(ArrowDownwardIcon)({
  animation: `${rotate} 1s infinite`,
  color: "#0097A7",
  fontSize: "2rem",
  transition: "transform 0.3s ease",
});

const LoadingContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100dvh",
});

const SearchInputContainer = styled("div")(({ theme }) => ({
  padding: 8,
  width: "100%",
  position: "sticky",
  top: -3,
  zIndex: theme.zIndex.appBar,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1100,
  padding: "5px 10px",
  fontSize: "12px",
  borderRadius: "20px",
  background:
    "linear-gradient(120deg, rgba(0, 121, 107, 0.25), rgba(150, 190, 220, 0.25))",
  color: "#fff",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, background 0.3s ease",
  "&:hover": {
    background: "linear-gradient(120deg, #004D40, rgba(120, 160, 190, 1))",
    transform: "translateX(-50%) translateY(-5px)",
  },
  bottom: "10%",
  [theme.breakpoints.down("sm")]: {
    bottom: "70px",
  },
}));

const SkeletonFeed = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "16px",
});

const FeedSection = ({
  linkupList,
  isLoading,
  setIsLoading,
  setShouldFetchLinkups,
  onRefreshClick,
  userId,
  gender,
  feedRef,
  colorMode,
  isMobile,
}) => {
  const dispatch = useDispatch();

  // Memoized selectors
  const userSentRequests = useSelector((state) => state.userSentRequests);
  const showNewLinkupButton = useSelector(
    (state) => state.linkups.showNewLinkupButton
  );
  const { userSettings } = useSelector((state) => state.userSettings);

  // State
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredLinkups, setFilteredLinkups] = useState([]);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Moved calculateAge inside the component
  const calculateAge = useCallback((dob) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    if (
      month < birthDate.getMonth() ||
      (month === birthDate.getMonth() && day < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }, []);

  // Memoized derived values
  const { distanceRange, ageRange, genderPreferences } = useMemo(
    () => ({
      distanceRange: userSettings?.distanceRange || [0, 1000],
      ageRange: userSettings?.ageRange || [18, 99],
      genderPreferences: userSettings?.genderPreferences || [],
    }),
    [userSettings]
  );

  // Filter linkups with memoization
  const filterLinkups = useCallback(() => {
    if (!linkupList || linkupList.length === 0) return [];

    return linkupList.filter((linkup) => {
      if (linkup.creator_id === userId) return true;

      const distance = linkup.distance || 0;
      if (distance < distanceRange[0] || distance > distanceRange[1])
        return false;

      const age = calculateAge(linkup.date_of_birth) || 0;
      if (age < ageRange[0] || age > ageRange[1]) return false;

      if (
        genderPreferences.length > 0 &&
        !genderPreferences.includes(linkup.creator_gender.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [
    linkupList,
    userId,
    distanceRange,
    ageRange,
    genderPreferences,
    calculateAge,
  ]);

  // Apply filtering with loading state
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setFilteredLinkups(filterLinkups());
      setIsFiltering(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [filterLinkups]);

  // Scroll handlers
  const scrollToTop = useCallback(() => {
    feedRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [feedRef]);

  const handleScroll = useCallback(() => {
    setShowScrollToTopButton(feedRef.current?.scrollTop > 200);
  }, [feedRef]);

  // Scroll event listener
  useEffect(() => {
    const currentRef = feedRef.current;
    if (!currentRef) return;

    currentRef.addEventListener("scroll", handleScroll);
    return () => currentRef.removeEventListener("scroll", handleScroll);
  }, [feedRef, handleScroll]);

  // Debounced search
  const debounceSearchRef = useRef(
    debounce(async (value) => {
      try {
        setSearchLoading(true);
        const response = await searchLinkups(
          value,
          userId,
          gender,
          distanceRange,
          ageRange
        );
        dispatch(fetchLinkupsSuccess(response.linkupList));
        setFilteredLinkups(response.linkupList);
      } catch (error) {
        console.error("Error searching linkups:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 300)
  ).current;

  const handleInputChange = useCallback(
    (event) => {
      setSearchLoading(true);
      debounceSearchRef(event.target.value);
    },
    [debounceSearchRef]
  );

  // Combined loading states
  const showLoading = isLoading || isFiltering || searchLoading;
  const showContent = !isLoading && !isFiltering && !searchLoading;

  // Memoized linkup items
  const renderedLinkups = useMemo(
    () =>
      filteredLinkups.map((linkup) => (
        <LinkupItem
          key={linkup.id}
          linkupItem={linkup}
          setShouldFetchLinkups={setShouldFetchLinkups}
          disableRequest={userSentRequests.some(
            (request) => request.linkup_id === linkup.id
          )}
        />
      )),
    [filteredLinkups, setShouldFetchLinkups, userSentRequests]
  );

  return (
    <Root isMobile={isMobile}>
      <TopNavBar title="Home" />
      <SearchInputContainer>
        <SearchInput
          handleInputChange={handleInputChange}
          loading={searchLoading}
        />
      </SearchInputContainer>

      {showLoading ? (
        <LoadingContainer>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <SkeletonFeed>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} variant="rounded" width="100%" height={120} />
              ))}
            </SkeletonFeed>
          )}
        </LoadingContainer>
      ) : (
        showContent && (
          <>
            {linkupList.length === 0 ? (
              <EmptyFeedPlaceholder />
            ) : (
              renderedLinkups
            )}
            {showNewLinkupButton && (
              <NewLinkupButton onClick={onRefreshClick} />
            )}
            {showScrollToTopButton && (
              <StyledButton variant="contained" onClick={scrollToTop}>
                Scroll to Top
              </StyledButton>
            )}
          </>
        )
      )}
    </Root>
  );
};

export default React.memo(FeedSection);
