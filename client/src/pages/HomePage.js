import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import FeedSection from "../components/FeedSection";
import WidgetSection from "../components/WidgetSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";
import { fetchLinkupRequestsSuccess } from "../redux/actions/userSentRequestsActions";
import { getLinkups } from "../api/linkupAPI";
import { getLinkupRequests } from "../api/linkupRequestAPI";

const useStyles = makeStyles((theme) => ({
  homePage: {
    display: "flex",
    width: "100%",
  },
  feedSection: {
    flex: "2",
    overflowY: "auto",
    // overflowX: "hidden",
    marginLeft: "auto",
    marginRight: "auto",
    borderRight: "1px solid #ccc",
  },
  widgetSection: {
    flex: "1",
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
  const dispatch = useDispatch();
  const feedSectionRef = useRef(null);
  const linkupList = useSelector((state) => state.linkups.linkupList);
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser.user.id;
  const gender = loggedUser.user.gender;
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(true);
  const [fetchedLinkupIds, setFetchedLinkupIds] = useState([]);
  const totalPages = Math.ceil(linkupList[0]?.total_active_linkups / PAGE_SIZE);

  const fetchLinkupsAndPoll = useCallback(
    async (page) => {
      setIsFetchingNextPage(true);
      try {
        if (!userId) return;
        const adjustedPage = page - 1;
        const sqlOffset = adjustedPage * PAGE_SIZE;
        const response = await getLinkups(userId, gender, sqlOffset, PAGE_SIZE);
        if (response.success) {
          const activeLinkups = response.linkupList.filter(
            (linkup) => linkup.status === "active"
          );
          const updatedLinkupList =
            page === 1 ? activeLinkups : [...linkupList, ...activeLinkups];
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
          updatedLinkupList.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          dispatch(fetchLinkupsSuccess(updatedLinkupList));
          setCurrentPage(page);
          const newFetchedLinkupIds = newLinkups.map((linkup) => linkup.id);
          setFetchedLinkupIds([...fetchedLinkupIds, ...newFetchedLinkupIds]);
        } else {
          console.error("Error fetching linkups:", response.message);
        }
      } catch (error) {
        console.error("Error fetching linkups:", error);
      } finally {
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
  }, [fetchLinkupsAndPoll, shouldFetchLinkups]);

  useEffect(() => {
    const scrollContainer = feedSectionRef.current;
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const fetchLinkupRequests = useCallback(async () => {
    try {
      if (!userId) return;
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
        <div className={classes.widgetSection}>
          <WidgetSection
            setShouldFetchLinkups={setShouldFetchLinkups}
            scrollToTopCallback={scrollToTop}
            onRefreshClick={refreshLinkups}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
