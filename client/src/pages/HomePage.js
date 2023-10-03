import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import FeedSection from "../components/FeedSection";
import CreateLinkupForm from "../components/CreateLinkupForm";
import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";
import { getLinkupRequests } from "../api/linkupRequestAPI";
import { getLinkups } from "../api/linkupAPI";
import { fetchLinkupRequestsSuccess } from "../redux/actions/userSentRequestsActions";
import LoadingSpinner from "../components/LoadingSpinner";

const useStyles = makeStyles((theme) => ({
  homePage: {
    display: "flex",
    width: "100%",
  },
  feedSection: {
    flex: "2",
    overflowY: "auto",
    overflowX: "hidden",
    marginLeft: "auto",
    marginRight: "auto",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
}));

const PAGE_SIZE = 10;

const HomePage = ({ isMobile }) => {
  const classes = useStyles();
  const feedSectionRef = useRef(null);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(true);
  const [totalPages, setTotalPages] = useState(1); // Define and initialize totalPages

  const linkupList = useSelector((state) => state.linkups.linkupList);
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser.user.id;
  const gender = loggedUser.user.gender;

  const [fetchedLinkupIds, setFetchedLinkupIds] = useState([]); // Maintain a list of already fetched linkup IDs

  const fetchLinkupsAndPoll = useCallback(
    async (page) => {
      setIsFetchingNextPage(true);
      try {
        // Fetch linkups for the current page
        const adjustedPage = page - 1;
        const sqlOffset = adjustedPage * PAGE_SIZE;
        const response = await getLinkups(userId, gender, sqlOffset, PAGE_SIZE);

        if (response.success) {
          const activeLinkups = response.linkupList.filter(
            (linkup) => linkup.status === "active"
          );

          // Combine the existing linkupList and the newly fetched linkups
          const updatedLinkupList =
            page === 1 ? activeLinkups : [...linkupList, ...activeLinkups];

          // Filter out linkups that have already been fetched
          const newLinkups = updatedLinkupList.filter(
            (newLinkup) =>
              !fetchedLinkupIds.includes(newLinkup.id) ||
              updatedLinkupList.some(
                (existingLinkup) =>
                  existingLinkup.id === newLinkup.id &&
                  new Date(newLinkup.updated_at) >
                    new Date(existingLinkup.updated_at)
              )
          );

          // Sort the updated list by created_at in descending order
          updatedLinkupList.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          // Dispatch the updated linkup list without blocking the UI
          requestAnimationFrame(() => {
            dispatch(fetchLinkupsSuccess(updatedLinkupList));
          });

          setCurrentPage(page);

          // Add the IDs of the newly fetched linkups to the list of fetched IDs
          const newFetchedLinkupIds = newLinkups.map((linkup) => linkup.id);
          setFetchedLinkupIds([...fetchedLinkupIds, ...newFetchedLinkupIds]);

          // Calculate totalPages based on the total number of linkups and PAGE_SIZE
          const totalLinkups = response.linkupList[0]?.total_active_linkups;
          const totalPages = Math.ceil(totalLinkups / PAGE_SIZE);
          setTotalPages(totalPages);
        } else {
          console.error("Error fetching linkups:", response.message);
        }

        setIsFetchingNextPage(false);
      } catch (error) {
        console.error("Error fetching linkups:", error);
        setIsFetchingNextPage(false);
      }
    },
    [dispatch, fetchedLinkupIds, gender, linkupList, userId]
  );

  const handleScroll = useCallback(() => {
    const threshold = 10;
    if (
      feedSectionRef.current &&
      feedSectionRef.current.scrollHeight - feedSectionRef.current.scrollTop <=
        feedSectionRef.current.clientHeight + threshold
    ) {
      if (currentPage < totalPages && !isFetchingNextPage) {
        fetchLinkupsAndPoll(currentPage + 1);
      }
    }
  }, [currentPage, fetchLinkupsAndPoll, isFetchingNextPage, totalPages]);

  useEffect(() => {
    if (shouldFetchLinkups) {
      fetchLinkupsAndPoll(1);
      setShouldFetchLinkups(false);
    }
  }, [dispatch, fetchLinkupsAndPoll, shouldFetchLinkups]);

  useEffect(() => {
    const scrollContainer = feedSectionRef.current;
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const fetchLinkupRequests = useCallback(async () => {
    try {
      const response = await getLinkupRequests(userId);
      if (response.success) {
        dispatch(fetchLinkupRequestsSuccess(response.linkupRequestList));
      } else {
        console.error("Error fetching linkup requests:", response.message);
      }
    } catch (error) {
      console.error("Error fetching linkup requests:", error);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    fetchLinkupRequests();
  }, [fetchLinkupRequests]);

  const refreshLinkups = useCallback(() => {
    // Manually trigger a refresh to get the latest linkups
    fetchLinkupsAndPoll(1);
    scrollToTop();
  }, [fetchLinkupsAndPoll]);

  const scrollToTop = () => {
    if (feedSectionRef.current) {
      feedSectionRef.current.scrollTop = 0;
    }
  };

  return (
    <div className={classes.homePage}>
      <div className={classes.feedSection} ref={feedSectionRef}>
        <FeedSection
          linkupList={linkupList}
          isLoading={isFetchingNextPage}
          setShouldFetchLinkups={setShouldFetchLinkups}
          refreshLinkups={refreshLinkups}
        />
        {isFetchingNextPage && (
          <div className={classes.loadingContainer}>
            <LoadingSpinner />
          </div>
        )}
      </div>
      {!isMobile && (
        <CreateLinkupForm
          setShouldFetchLinkups={setShouldFetchLinkups}
          scrollToTopCallback={scrollToTop}
        />
      )}
    </div>
  );
};

export default HomePage;
