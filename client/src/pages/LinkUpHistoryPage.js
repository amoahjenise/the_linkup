import React from "react";
import LinkUpActive from "../components/LinkUpActive";
import LeftMenu from "../components/LeftMenu";
import { makeStyles } from "@material-ui/core/styles";
import TopNavBar from "../components/TopNavBar";

const drawerWidth = "20%";

const useStyles = makeStyles((theme) => ({
  linkUpHistoryPage: {
    display: "flex",
    height: "100vh",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    maxWidth: `calc(100% - 2.5 * ${drawerWidth})`,
    width: "100%",
    borderRight: "1px solid #e1e8ed",
  },
}));

const LinkUpHistoryPage = () => {
  const classes = useStyles();

  const tabs = [
    { id: 1, label: "Active Link-Ups" },
    { id: 2, label: "Requests Sent" },
    // { id: 3, label: "Link Ups" },
    // { id: 4, label: "Tab 4" },
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
      status: "active",
    },
    {
      id: 2,
      username: "Amanda",
      activity: "Yoga",
      location: "Central Park",
      date: "Tomorrow",
      type: "linkup",
      status: "Accepted",
    },
    {
      id: 3,
      username: "John",
      activity: "Running",
      location: "Beach",
      date: "Next Week",
      type: "trylink",
      status: "Declined",
    },
  ];

  return (
    <div className={classes.linkUpHistoryPage}>
      <LeftMenu />
      <div className={classes.mainContainer}>
        <TopNavBar title="Link Ups" tabs={tabs} />
        {linkUps.map((linkUp) => (
          <LinkUpActive key={linkUp.id} post={linkUp} />
        ))}
      </div>
      <div style={{ flex: 2 }} />
    </div>
  );
};

export default LinkUpHistoryPage;
