import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import FeedSection from "../components/FeedSection";
import CreateLinkupForm from "../components/CreateLinkupForm";
import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";
import { getLinkupRequests } from "../api/linkupRequestAPI";
import { getLinkups } from "../api/linkupAPI";
import { fetchLinkupRequestsSuccess } from "../redux/actions/userSentRequestsActions";

// Define CSS styles using makeStyles
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
}));

const HomePage = ({ isMobile }) => {
  const classes = useStyles();
  const feedSectionRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(true);
  const dispatch = useDispatch();

  // Access user data from Redux store
  const linkupList = useSelector((state) => state.linkups.linkupList);
  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser.user.id;
  const gender = loggedUser.user.gender;

  // Function to fetch active linkups
  const fetchLinkups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getLinkups(userId, gender);
      if (response.success) {
        // Filter active linkups and dispatch them to Redux
        const activeLinkups = response.linkupList.filter(
          (linkup) => linkup.status === "active"
        );
        dispatch(fetchLinkupsSuccess(activeLinkups));
      } else {
        console.error("Error fetching linkups:", response.message);
      }
    } catch (error) {
      console.error("Error fetching linkups:", error);
    } finally {
      // Set loading state to false with a slight delay for smoother UI
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [dispatch, gender, userId]);

  // Function to fetch user's linkup requests
  const fetchLinkupRequests = useCallback(async () => {
    try {
      const response = await getLinkupRequests(userId);
      if (response.success) {
        // Dispatch linkup requests to Redux store
        dispatch(fetchLinkupRequestsSuccess(response.linkupRequestList));
      } else {
        console.error("Error fetching linkup requests:", response.message);
      }
    } catch (error) {
      console.error("Error fetching linkup requests:", error);
    }
  }, [dispatch, userId]);

  // Fetch active linkups when the component mounts or when shouldFetchLinkups changes
  useEffect(() => {
    if (shouldFetchLinkups) {
      fetchLinkups();
      setShouldFetchLinkups(false);
    }
  }, [dispatch, fetchLinkups, shouldFetchLinkups]);

  // Fetch user's linkup requests when the component mounts
  useEffect(() => {
    fetchLinkupRequests();
  }, [fetchLinkupRequests]);

  // Define the callback function for scrolling to the top of the feed
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
          isLoading={isLoading}
          setShouldFetchLinkups={setShouldFetchLinkups}
        />
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
