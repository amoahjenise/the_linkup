import React, { useCallback, useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import FeedSection from "../components/FeedSection";
import CreateLinkupForm from "../components/CreateLinkupForm";
import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";
import { getLinkupRequests } from "../api/linkupRequestAPI";
import { getLinkups, markLinkupsAsExpired } from "../api/linkupAPI";
import { fetchLinkupRequestsSuccess } from "../redux/actions/userSentRequestsActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import moment from "moment";
import nlp from "compromise";
const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  homePage: {
    display: "flex",
    width: "100%",
  },
  feedSection: {
    flex: "2",
    overflowY: "auto",
    overflowX: "hidden",
    backgroundColor: theme.palette.background.default,
    marginLeft: "auto",
    marginRight: "auto",
  },
  editingFeedSection: {
    overflowY: "hidden",
  },
}));

const linkupSocketUrl = process.env.REACT_APP_LINKUP_SOCKET_IO_URL;

const HomePage = ({ isMobile }) => {
  const classes = useStyles();
  const { addSnackbar } = useSnackbar();
  const feedSectionRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(true);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  // Access user data from Redux store
  const linkupList = useSelector((state) => state.linkups.linkupList);

  const loggedUser = useSelector((state) => state.loggedUser);
  const userId = loggedUser.user.id;
  const gender = loggedUser.user.gender;

  const fetchLinkups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getLinkups(userId, gender);
      if (response.success) {
        const activeLinkups = response.linkupList.filter(
          (linkup) => linkup.status === "active"
        );
        dispatch(fetchLinkupsSuccess(activeLinkups));
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.log("Error fetching linkups:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [dispatch, gender, userId]);

  // Function to fetch linkup requests and set them in Redux store
  const fetchLinkupRequests = useCallback(async () => {
    try {
      const response = await getLinkupRequests(userId); // Fetch linkup requests
      if (response.success) {
        dispatch(fetchLinkupRequestsSuccess(response.linkupRequestList)); // Set linkup requests in Redux store
      } else {
        console.error("Error fetching linkup requests:", response.message);
      }
    } catch (error) {
      console.error("Error fetching linkup requests:", error);
    }
  }, [dispatch, userId]);

  const removeExpiredLinkups = useCallback(async () => {
    try {
      // Perform the API call to mark link-ups as expired
      const result = await markLinkupsAsExpired();

      if (result.success) {
        return result; // Return the result if needed
      } else {
        console.log("Error marking link-ups as expired:", result.message);
      }
    } catch (error) {
      console.log("Error marking link-ups as expired:", error);
    }
  }, []);

  const renderLinkupItemText = (data) => {
    const verb = compromise(data.activity).verbs().length > 0;
    const activityText = `The link up ${
      verb ? "to" : "for"
    } ${data.activity.toLowerCase()}`;
    const dateText = data.date ? moment(data.date).format("MMM DD, YYYY") : "";
    const timeText = data.date ? `(${moment(data.date).format("h:mm A")})` : "";
    const formattedLocation = data.location
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return `The link up ${activityText} at ${formattedLocation} on ${dateText} ${timeText} has expired.`;
  };

  useEffect(() => {
    if (shouldFetchLinkups) {
      removeExpiredLinkups();
      fetchLinkups();
      setShouldFetchLinkups(false);
    }
  }, [dispatch, fetchLinkups, removeExpiredLinkups, shouldFetchLinkups]);

  useEffect(() => {
    // Fetch linkup requests when the component mounts
    fetchLinkupRequests();
  }, [fetchLinkupRequests]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(linkupSocketUrl);
    setSocket(socket);

    // Listener for 'linkupsExpired' event
    const handleLinkupsExpired = (expiredLinkups) => {
      if (Array.isArray(expiredLinkups)) {
        const timeout = 7000; // Set the desired timeout in milliseconds

        console.log("Expired Link-Ups:", expiredLinkups);
        expiredLinkups.forEach((expiredLinkup) => {
          addSnackbar(renderLinkupItemText(expiredLinkup), { timeout });
        });
      } else {
        // Handle the case where expiredLinkups is not an array or is undefined
        console.error("Invalid expiredLinkups data:", expiredLinkups);
      }
    };

    socket.on("linkupsExpired", (data) => {
      handleLinkupsExpired(data);
    });

    return () => {
      // Clean up by disconnecting the socket and removing the event listener
      socket.off("linkupsExpired", handleLinkupsExpired);
      socket.disconnect();
    };
  }, [addSnackbar]);

  // Define the callback function for scrolling to the top
  const scrollToTop = () => {
    if (feedSectionRef.current) {
      feedSectionRef.current.scrollTop = 0;
    }
  };

  return (
    <div className={classes.homePage}>
      {isMobile ? (
        <div className={classes.feedSection}>
          <FeedSection
            linkupList={linkupList}
            isLoading={isLoading}
            setShouldFetchLinkups={setShouldFetchLinkups}
          />
        </div>
      ) : (
        <div className={classes.homePage}>
          <div className={classes.feedSection} ref={feedSectionRef}>
            <FeedSection
              linkupList={linkupList}
              isLoading={isLoading}
              setShouldFetchLinkups={setShouldFetchLinkups}
            />
          </div>
          <CreateLinkupForm
            socket={socket}
            setShouldFetchLinkups={setShouldFetchLinkups}
            scrollToTopCallback={scrollToTop}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
