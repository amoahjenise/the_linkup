import React, { useCallback, useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import FeedSection from "../components/FeedSection";
import CreateLinkupForm from "../components/CreateLinkupForm";
import EditLinkupForm from "../components/EditLinkupForm";
import {
  setIsLoading,
  fetchLinkupsSuccess,
} from "../redux/actions/linkupActions";
import { getLinkups, markLinkupsAsExpired } from "../api/linkupAPI";
import { useSnackbar } from "../contexts/SnackbarContext";
import moment from "moment";
import nlp from "compromise";
const compromise = nlp;

const useStyles = makeStyles((theme) => ({
  homePage: {
    display: "flex",
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

const HomePage = ({ linkupList, isLoading }) => {
  const classes = useStyles();
  const { addSnackbar } = useSnackbar();
  const feedSectionRef = useRef(null);
  const editingLinkup = useSelector((state) => state.editingLinkup);
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(true);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  // Access user data from Redux store
  const loggedUser = useSelector((state) => state.loggedUser);
  const userID = loggedUser.user.id;
  const gender = loggedUser.user.gender;

  const fetchLinkups = useCallback(async () => {
    dispatch(setIsLoading(true));
    try {
      const response = await getLinkups(userID, gender);
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
      dispatch(setIsLoading(false));
    }
  }, [dispatch, userID]);

  const removeExpiredLinkups = useCallback(async () => {
    try {
      // Perform the API call to mark link-ups as expired
      const result = await markLinkupsAsExpired();

      if (result.success) {
        // dispatch(updateLinkupList(result.linkupList)); // Dispatch the updated linkupList to Redux store
        return result; // Return the result if needed
      } else {
        console.log("Error marking link-ups as expired:", result.message);
      }
    } catch (error) {
      console.log("Error marking link-ups as expired:", error);
    }
  }, []);

  const renderLinkupItemText = (data) => {
    const doc = compromise(data.activity);
    const startsWithVerb = doc.verbs().length > 0;
    const isVerbEndingWithIng = data.activity.endsWith("ing");

    let activityText = "";
    if (data.activity) {
      if (isVerbEndingWithIng) {
        activityText = `for ${data.activity}`;
      } else {
        activityText = `${startsWithVerb ? "to" : "for"} ${data.activity}`;
      }
    }
    const dateText = data.date
      ? `${moment(data.date).format("MMM DD, YYYY")}`
      : "";
    const timeText = data.date ? `(${moment(data.date).format("h:mm A")})` : "";

    // Capitalize the first letter of each word in the location
    const formattedLocation = data.location
      .toLowerCase() // Convert to lowercase
      .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()); // Capitalize first letter of each word

    const text = `The link up for ${activityText.toLowerCase()} at ${formattedLocation} on ${dateText} ${timeText} has expired.`;

    return text;
  };

  useEffect(() => {
    if (shouldFetchLinkups) {
      removeExpiredLinkups();
      fetchLinkups();
      setShouldFetchLinkups(false);
    }
  }, [dispatch, fetchLinkups, removeExpiredLinkups, shouldFetchLinkups]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(linkupSocketUrl);
    setSocket(socket);

    // Listener for 'linkupsExpired' event
    const handleLinkupsExpired = (expiredLinkups) => {
      const timeout = 7000; // Set the desired timeout in milliseconds

      console.log("Expired Link-Ups:", expiredLinkups);
      expiredLinkups.forEach((expiredLinkup) => {
        addSnackbar(renderLinkupItemText(expiredLinkup), { timeout });
      });
    };

    socket.on("linkupsExpired", (data) => {
      handleLinkupsExpired(data);
    });

    return () => {
      // Clean up by disconnecting the socket and removing the event listener
      socket.off("linkupsExpired", handleLinkupsExpired);
      socket.disconnect();
    };
  }, []);

  // Define the callback function for scrolling to the top
  const scrollToTop = () => {
    if (feedSectionRef.current) {
      feedSectionRef.current.scrollTop = 0;
    }
  };

  return (
    <div className={classes.homePage}>
      <div
        className={`${classes.feedSection} ${
          editingLinkup.isEditing ? classes.editingFeedSection : ""
        }`}
        ref={feedSectionRef}
      >
        <FeedSection
          linkupList={linkupList}
          isLoading={isLoading}
          setShouldFetchLinkups={setShouldFetchLinkups}
        />
      </div>
      {editingLinkup.isEditing ? (
        <EditLinkupForm setShouldFetchLinkups={setShouldFetchLinkups} />
      ) : (
        <CreateLinkupForm
          socket={socket}
          setShouldFetchLinkups={setShouldFetchLinkups}
          scrollToTopCallback={scrollToTop}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  linkupList: state.linkups.linkupList,
  isLoading: state.linkups.isLoading,
});

export default connect(mapStateToProps)(HomePage);
