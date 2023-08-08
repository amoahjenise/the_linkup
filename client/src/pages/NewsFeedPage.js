import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LeftMenu from "../components/LeftMenu";
import FeedSection from "../components/FeedSection";
import CreateLinkUpForm from "../components/CreateLinkUpForm";
import { getPendingLinkups, createLinkUp } from "../api/linkUpAPI";

const drawerWidth = "20%";

const useStyles = makeStyles((theme) => ({
  newsFeedPage: {
    display: "flex",
    height: "100vh",
  },
  logoContainer: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(2),
    },
  },
  logo: {
    height: "50px",
    marginBottom: theme.spacing(2),
  },
  feedSection: {
    flex: "2",
    overflowY: "auto",
    maxWidth: `calc(100% - 2 * ${drawerWidth})`,
    marginLeft: "auto",
    marginRight: "auto",
    borderRight: "1px solid #e1e8ed",
  },
}));

const NewsFeedPage = () => {
  const classes = useStyles();
  const [linkUps, setLinkUps] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [startIndex, setStartIndex] = useState(0);
  const feedSectionRef = useRef(null); // Reference to the feed section container

  useEffect(() => {
    const fetchPendingLinkups = async () => {
      try {
        const response = await getPendingLinkups();

        if (response?.linkUps.length > 0) {
          setLinkUps(response.linkUps);
        } else {
          setLinkUps([]);
        }
      } catch (error) {
        console.log("Error fetching linkups:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 300); // Delay setting loading state to false by 300 milliseconds
      }
    };

    fetchPendingLinkups();
  }, []);

  useEffect(() => {
    // Scroll to the first link up in the feed section when linkUps are updated
    if (feedSectionRef.current) {
      feedSectionRef.current.scrollTop = 0;
    }
  }, [linkUps]);

  const handleLoadMore = () => {
    // Load more posts when the "Load more" button is clicked
    setStartIndex((prevIndex) => prevIndex + 10);
  };

  return (
    <div>
      <div className={classes.newsFeedPage}>
        <LeftMenu />
        <div
          className={classes.feedSection}
          ref={feedSectionRef} // Attach the ref to the feed section
        >
          <FeedSection
            linkUps={linkUps.slice(0, startIndex + 10)}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
          />
        </div>
        <CreateLinkUpForm createLinkup={createLinkUp} setLinkUps={setLinkUps} />
      </div>
    </div>
  );
};

export default NewsFeedPage;
