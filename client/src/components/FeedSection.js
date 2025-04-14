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
import { Skeleton } from "@mui/material";
// import PullToRefresh from "react-pull-to-refresh";
// import { CircularProgress } from "@mui/material";
import { keyframes } from "@mui/system";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const Root = styled("div")(({ theme, isMobile }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderRadius: "8px",
  maxWidth: "100vw",
  minHeight: "100dvh",
  marginBottom: isMobile ? 64 : 15,
}));

// Animation for the arrow
const rotate = keyframes`
  0% { transform: rotate(0deg); opacity: 0.5; }
  50% { transform: rotate(180deg); opacity: 1; }
  100% { transform: rotate(360deg); opacity: 0.5; }
`;

// Styled arrow component
const RefreshArrow = styled(ArrowDownwardIcon)({
  animation: `${rotate} 1s infinite`,
  color: "#0097A7", // Your brand color
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

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

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
  const userSentRequests = useSelector((state) => state.userSentRequests);
  const showNewLinkupButton = useSelector(
    (state) => state.linkups.showNewLinkupButton
  );
  const { userSettings } = useSelector((state) => state.userSettings);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredLinkups, setFilteredLinkups] = useState([]);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const distanceRange = userSettings?.distanceRange || [0, 1000];
  const ageRange = userSettings?.ageRange || [18, 99];
  const genderPreferences = userSettings?.genderPreferences || [];

  // Apply filtering logic with loading state
  useEffect(() => {
    if (!linkupList || linkupList.length === 0) {
      setFilteredLinkups([]);
      return;
    }

    const filterLinkups = () => {
      setIsFiltering(true);
      try {
        return linkupList.filter((linkup) => {
          if (linkup.creator_id === userId) {
            return true;
          }

          const distance = linkup.distance || 0;
          if (distance < distanceRange[0] || distance > distanceRange[1]) {
            return false;
          }

          const age = calculateAge(linkup.date_of_birth) || 0;
          if (age < ageRange[0] || age > ageRange[1]) {
            return false;
          }

          if (
            genderPreferences.length > 0 &&
            !genderPreferences.includes(linkup.creator_gender.toLowerCase())
          ) {
            return false;
          }

          return true;
        });
      } finally {
        setIsFiltering(false);
      }
    };

    const filtered = filterLinkups();
    setFilteredLinkups(filtered);
  }, [linkupList, userSettings, userId]);

  const scrollToTop = () => {
    if (feedRef.current) {
      feedRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (feedRef.current) {
      setShowScrollToTopButton(feedRef.current.scrollTop > 200);
    }
  };

  useEffect(() => {
    const currentRef = feedRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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
  );

  const handleInputChange = (event) => {
    setSearchLoading(true);
    debounceSearchRef.current(event.target.value);
  };

  // // Combined loading states
  const showLoading = isLoading || isFiltering || searchLoading;
  const showContent = !isLoading && !isFiltering && !searchLoading;

  // const PullToRefreshContainer = ({ onRefresh, children }) => {
  //   const [pulling, setPulling] = useState(false);
  //   const [refreshing, setRefreshing] = useState(false);

  //   return (
  //     <div
  //       style={{ position: "relative" }}
  //       onTouchStart={(e) => {
  //         if (window.scrollY === 0) {
  //           setPulling(true);
  //         }
  //       }}
  //       onTouchMove={(e) => {
  //         if (pulling && window.scrollY === 0) {
  //           const pullDistance = e.touches[0].clientY;
  //           if (pullDistance > 80) {
  //             // 80px threshold
  //             setRefreshing(true);

  //             Promise.all([
  //               new Promise((resolve) => setTimeout(resolve, 500)), // Minimum 1 second display
  //             ]).finally(() => {
  //               onRefresh();
  //               setRefreshing(false);
  //             });
  //           }
  //         }
  //       }}
  //       onTouchEnd={() => {
  //         setPulling(false);
  //         if (!refreshing) {
  //           setRefreshing(false);
  //         }
  //       }}
  //     >
  //       {(pulling || refreshing) && (
  //         <div
  //           style={{
  //             position: "absolute",
  //             top: 0,
  //             left: 0,
  //             right: 0,
  //             display: "flex",
  //             justifyContent: "center",
  //             padding: "16px 0",
  //             height: "60px",
  //             alignItems: "center",
  //           }}
  //         >
  //           {/* {refreshing ? (
  //             <CircularProgress color="primary" />
  //           ) : ( */}
  //           <ArrowDownwardIcon
  //             style={{
  //               animation: refreshing ? `${rotate} 1s infinite` : "none",
  //               color: "#0097A7",
  //               fontSize: "1.5rem",
  //               transform: `rotate(${refreshing ? 180 : 0}deg)`,
  //               transition: "transform 0.3s ease",
  //               opacity: 0.6,
  //             }}
  //           />
  //           {/* )} */}
  //         </div>
  //       )}
  //       <div
  //         style={{
  //           transform: refreshing ? "translateY(60px)" : "none",
  //           transition: "transform 0.3s ease",
  //         }}
  //       >
  //         {children}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <Root isMobile={isMobile}>
      <TopNavBar title="Home" />
      {/* <PullToRefreshContainer onRefresh={onRefreshClick}> */}
      <SearchInputContainer>
        <SearchInput
          handleInputChange={handleInputChange}
          loading={searchLoading}
        />
      </SearchInputContainer>
      {showLoading && (
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
      )}
      {showContent && (
        <>
          {linkupList.length === 0 ? (
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
              Scroll to Top
            </StyledButton>
          )}
        </>
      )}
      {/* </PullToRefreshContainer> */}
    </Root>
  );
};

export default FeedSection;
