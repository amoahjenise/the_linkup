import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LeftMenu from "../components/LeftMenu";
import FeedSection from "../components/FeedSection";
import CreateLinkUpForm from "../components/CreateLinkUpForm";
import { getActiveLinkUps, createLinkUp } from "../api/linkUpAPI";

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
    marginBottom: theme.spacing(2), // Add margin-bottom for the logo
  },
  feedSection: {
    flex: "2", // Update the flex value to take the remaining space
    overflowY: "auto",
    maxWidth: "calc(100% - 2 * " + drawerWidth + ")", // Calculate the width based on the drawer width
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const NewsFeedPage = () => {
  const classes = useStyles();
  const [linkUps, setLinkUps] = useState([]);

  useEffect(() => {
    // Fetch active link ups from the API
    const fetchActiveLinkUps = async () => {
      try {
        const response = await getActiveLinkUps();
        setLinkUps(response);
      } catch (error) {
        console.log("Error fetching active link ups:", error);
      }
    };

    fetchActiveLinkUps();
  }, []);

  const updateFeed = async (newLinkUp) => {
    try {
      // Call the API to create the link-up
      const response = await createLinkUp(newLinkUp);

      // Update the link-ups state with the newly created link-up at the beginning
      setLinkUps([response.data, ...linkUps]);
    } catch (error) {
      console.log("Error updating feed:", error);
      // Handle error if needed
    }
  };

  return (
    <div>
      <div className={classes.newsFeedPage}>
        <LeftMenu />
        <div className={classes.feedSection}>
          <FeedSection linkUps={linkUps} />
        </div>
        <CreateLinkUpForm updateFeed={updateFeed} />
      </div>
    </div>
  );
};

export default NewsFeedPage;
