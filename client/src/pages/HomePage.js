import React, { useCallback, useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import FeedSection from "../components/FeedSection";
import CreateLinkupForm from "../components/CreateLinkupForm";
import { fetchLinkupsSuccess } from "../redux/actions/linkupActions";
import { getLinkupRequests } from "../api/linkupRequestAPI";
import { getLinkups } from "../api/linkupAPI";
import { fetchLinkupRequestsSuccess } from "../redux/actions/userSentRequestsActions";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useSocket } from "../SocketContext";
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
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const HomePage = ({ isMobile }) => {
  const classes = useStyles();
  const { addSnackbar } = useSnackbar();
  const feedSectionRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldFetchLinkups, setShouldFetchLinkups] = useState(true);
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
        console.error("Error fetching linkups:", response.message); // Changed from console.log to console.error
      }
    } catch (error) {
      console.error("Error fetching linkups:", error);
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

  // Use the useSocket hook to get the socket instance
  const socket = useSocket();

  useEffect(() => {
    if (shouldFetchLinkups) {
      fetchLinkups();
      setShouldFetchLinkups(false);
    }
  }, [dispatch, fetchLinkups, shouldFetchLinkups]);

  useEffect(() => {
    // Fetch linkup requests when the component mounts
    fetchLinkupRequests();
  }, [fetchLinkupRequests]);

  // useEffect(() => {
  //   if (socket) {
  //     // Check if the socket is connected when the component mounts
  //     if (socket.connected) {
  //       console.log("Socket is connected to the server.");

  //       // Add event listeners here
  //       socket.on("linkupsExpired", (data) => {
  //         handleLinkupsExpired(data);
  //       });

  //       socket.on("connect_error", (error) => {
  //         console.error("Socket.IO connection error:", error);
  //       });

  //       // Example: Emit an event to the server
  //       socket.emit("someEventFromClient", {
  //         message: "Hello from the client!",
  //       });
  //     } else {
  //       console.log("Socket is not connected.");
  //     }

  //     return () => {
  //       // Clean up by removing the event listener
  //       socket.off("linkupsExpired");
  //     };
  //   }
  // }, []);

  // Listener for 'linkupsExpired' event
  // const handleLinkupsExpired = (expiredLinkups) => {
  //   console.log("handleLinkupsExpired", expiredLinkups);

  //   if (Array.isArray(expiredLinkups)) {
  //     const timeout = 7000; // Set the desired timeout in milliseconds
  //     console.log("Expired Link-Ups:", expiredLinkups);
  //     expiredLinkups.forEach((expiredLinkup) => {
  //       addSnackbar(renderLinkupItemText(expiredLinkup), { timeout });
  //     });
  //   } else {
  //     // Handle the case where expiredLinkups is not an array or is undefined
  //     console.error("Invalid expiredLinkups data:", expiredLinkups);
  //   }
  // };

  // Define the callback function for scrolling to the top
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
          // socket={socket}
          setShouldFetchLinkups={setShouldFetchLinkups}
          scrollToTopCallback={scrollToTop}
        />
      )}
    </div>
  );
};

export default HomePage;
