import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import LoadingSpinner from "./LoadingSpinner";
import EmptyFeedPlaceholder from "./EmptyFeedPlaceholder";
import LinkupItem from "./LinkupItem";
import TopNavBar from "./TopNavBar";
import NewLinkupButton from "./NewLinkupButton";
import SearchInput from "./SearchInputWidget";
import { searchLinkups } from "../api/linkUpAPI";
import debounce from "lodash/debounce";

const Root = styled("div")(({ isMobile }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderRadius: "8px",
  maxWidth: "100vw",
  minHeight: "100dvh",
  marginBottom: isMobile ? 64 : 0,
  width: "100%",
}));

const SearchInputContainer = styled("div")(({ theme }) => ({
  padding: 8,
  width: "100%",
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const ScrollToTopButton = styled(Button)(({ colorMode }) => ({
  position: "sticky",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: "80px",
  zIndex: 1100,
  width: "100px",
  height: "32px",
  borderRadius: "9999px",
  backgroundColor: "rgba(0, 151, 167, 0.3)",
  color: "#FFFFFF",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(0, 151, 167, 0.3)",
  padding: 0,
  opacity: 0.9,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
}));

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
  const userSentRequests = useSelector((state) => state.userSentRequests);
  const { userSettings } = useSelector((state) => state.userSettings);
  const showNewLinkupButton = useSelector(
    (state) => state.linkups.showNewLinkupButton
  );

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  const calculateAge = useCallback((dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }, []);

  const { distanceRange, ageRange, genderPreferences } = useMemo(
    () => ({
      distanceRange: userSettings?.distanceRange || [0, 1000],
      ageRange: userSettings?.ageRange || [18, 99],
      genderPreferences: userSettings?.genderPreferences || [],
    }),
    [userSettings]
  );

  const filterLinkups = useCallback(() => {
    return linkupList.filter((linkup) => {
      if (linkup.creator_id === userId) return true;

      const distance = linkup.distance || 0;
      const age = calculateAge(linkup.date_of_birth) || 0;
      const genderMatch =
        genderPreferences.length === 0 ||
        genderPreferences.includes(linkup.creator_gender?.toLowerCase());

      return (
        distance >= distanceRange[0] &&
        distance <= distanceRange[1] &&
        age >= ageRange[0] &&
        age <= ageRange[1] &&
        genderMatch
      );
    });
  }, [
    linkupList,
    userId,
    distanceRange,
    ageRange,
    genderPreferences,
    calculateAge,
  ]);

  const filteredLinkups = useMemo(() => filterLinkups(), [filterLinkups]);

  const activeList = isSearching ? searchResults : filteredLinkups;

  const handleScroll = () => {
    if (feedRef.current) {
      setShowScrollToTopButton(feedRef.current.scrollTop > 200);
    }
  };

  useEffect(() => {
    const ref = feedRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      return () => ref.removeEventListener("scroll", handleScroll);
    }
  }, [feedRef]);

  const scrollToTop = () => {
    feedRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const debounceSearch = useRef(
    debounce(async (value) => {
      try {
        const response = await searchLinkups(
          value,
          userId,
          gender,
          distanceRange,
          ageRange
        );
        setSearchResults(response.linkupList || []);
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 300)
  ).current;

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setSearchLoading(true);

    if (value === "") {
      setIsSearching(false);
      setSearchLoading(false);
      return;
    }

    setIsSearching(true);
    debounceSearch(value);
  };

  return (
    <Root isMobile={isMobile}>
      <TopNavBar title="Home" />

      <SearchInputContainer>
        <SearchInput
          handleInputChange={handleInputChange}
          loading={searchLoading}
        />
      </SearchInputContainer>

      {showNewLinkupButton && (
        <NewLinkupButton onClick={onRefreshClick} colorMode={colorMode} />
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : activeList.length === 0 ? (
        <EmptyFeedPlaceholder />
      ) : (
        <>
          {activeList.map((linkup) => (
            <LinkupItem
              key={linkup.id}
              linkupItem={linkup}
              setShouldFetchLinkups={setShouldFetchLinkups}
              disableRequest={userSentRequests.some(
                (req) => req.linkup_id === linkup.id
              )}
            />
          ))}
        </>
      )}

      {showScrollToTopButton && (
        <ScrollToTopButton onClick={scrollToTop} colorMode={colorMode}>
          <ArrowUpwardIcon sx={{ fontSize: "16px" }} />
          Top
        </ScrollToTopButton>
      )}
    </Root>
  );
};

export default React.memo(FeedSection);
