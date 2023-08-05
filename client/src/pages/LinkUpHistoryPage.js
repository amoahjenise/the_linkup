import React from "react";
import LinkUpPending from "../components/LinkUpPending";
import LeftMenu from "../components/LeftMenu";
import { makeStyles } from "@material-ui/core/styles";
import TopNavBar from "../components/TopNavBar";

const useStyles = makeStyles((theme) => ({
  linkUpHistoryPage: {
    display: "flex",
    height: "100vh",
  },
  historySection: {
    flex: "1", // Update the flex value to take the remaining space
    overflowY: "auto",
  },
}));

const LinkUpHistoryPage = () => {
  const classes = useStyles();

  const tabs = [
    { id: 1, label: "Requests Sent" },
    { id: 2, label: "My Pending Link Ups" },
    { id: 3, label: "Link Ups" },
    { id: 4, label: "Tab 4" },
  ];

  // Mock data for multiple link ups
  const linkUps = [
    {
      id: 1,
      username: "Tyson",
      activity: "Soccer",
      location: "Jarry Park",
      date: "Today",
      type: "trylink",
      status: "Pending",
    },
    // {
    //   id: 2,
    //   username: "Amanda",
    //   activity: "Yoga",
    //   location: "Central Park",
    //   date: "Tomorrow",
    //   type: "linkup",
    //   status: "Accepted",
    // },
    // {
    //   id: 3,
    //   username: "John",
    //   activity: "Running",
    //   location: "Beach",
    //   date: "Next Week",
    //   type: "trylink",
    //   status: "Declined",
    // },
  ];

  return (
    <div className={classes.linkUpHistoryPage}>
      <LeftMenu />
      <div className={classes.historySection}>
        <TopNavBar title="Link Ups" tabs={tabs} />
        {linkUps.map((linkUp) => (
          <LinkUpPending key={linkUp.id} post={linkUp} />
        ))}
      </div>
    </div>
  );
};

export default LinkUpHistoryPage;
