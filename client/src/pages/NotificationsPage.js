import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Notifications from "../components/Notifications";
import TopNavBar from "../components/TopNavBar";
import LeftMenu from "../components/LeftMenu";

const useStyles = makeStyles((theme) => ({
  notificationsPage: {
    display: "flex",
    height: "100vh",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    minHeight: 0,
    width: "50%",
  },
  notificationContainer: {
    display: "flex",

    // flexDirection: "column",
    // alignItems: "center",
    backgroundColor: theme.palette.background.default,
    // overflowY: "auto",
    // width: "100%",
  },
  notificationSection: {
    flex: "1", // Update the flex value to take the remaining space
    overflowY: "auto",
  },
}));

const NotificationsPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.notificationsPage}>
      <LeftMenu />
      <div className={classes.notificationSection}>
        <div className={classes.container}>
          <TopNavBar title="Notifications" />
          <div className={classes.notificationContainer}>
            <Notifications />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
